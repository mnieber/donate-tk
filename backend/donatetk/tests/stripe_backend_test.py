from unittest.mock import Mock

import pytest
from django.conf import settings

from donatetk.stripe_backend import StripeBackend
from donatetk.utils.checksum import checksum_from_subscription, verify_checksum


class TestStripeBackend(object):
    @pytest.fixture()
    def mock_api(self, mocker):
        return mocker.patch("donatetk.stripe_backend.stripe")

    def test_create_customer_by_email(self, mock_api):
        customer_list = Mock()
        customer_list.data = []

        mock_api.Customer.list.return_value = customer_list
        mock_api.Customer.create.return_value = "new_customer"

        be = StripeBackend()
        assert be.get_or_create_customer_by_email("email@org.com") == "new_customer"
        mock_api.Customer.create.assert_called_once_with(email="email@org.com")

    def test_get_customer_by_email(self, mock_api):
        customer_list = Mock()
        customer_list.data = ["customer_0"]
        mock_api.Customer.list.return_value = customer_list

        be = StripeBackend()
        be.get_or_create_customer_by_email("email@org.com") == "customer_0"
        mock_api.Customer.create.assert_not_called()

    def test_get_customer_by_id(self, mock_api):
        be = StripeBackend()
        be.get_customer_by_id("123")
        mock_api.Customer.retrieve.assert_called_once_with("123")

    def test_create_charge(self, mock_api):
        be = StripeBackend()

        customer = Mock()
        customer.id = "stripe_customer"

        source = Mock()
        source.id = "source"

        be.create_charge(
            stripe_customer=customer,
            amount=2.13,
            source=source,
            currency="usd",
            description="friends",
        )
        mock_api.Charge.create.assert_called_once_with(
            amount=213,
            currency="usd",
            customer="stripe_customer",
            source="source",
            description="friends",
        )

    def test_cancel_cards(self, mock_api):
        be = StripeBackend()
        stripe_customer, source1, source2 = Mock(), Mock(), Mock()
        stripe_customer.sources = [source1, source2]
        be.cancel_cards(stripe_customer)
        source1.delete.assert_called_once_with()
        source2.delete.assert_called_once_with()

    def test_create_product(self, mock_api):
        be = StripeBackend()
        mock_api.Product.retrieve.side_effect = Exception("productnotfound")
        be._product_id = Mock(return_value="product_abc")
        be.create_product()

        mock_api.Product.retrieve.assert_called_once_with("product_abc")
        mock_api.Product.create.assert_called_once_with(
            id="product_abc", name="Donation to " + settings.DONATETK_ORG_NAME
        )

        mock_api.Product.retrieve.reset_mock()
        mock_api.Product.create.reset_mock()
        mock_api.Product.retrieve.return_value = "product"
        mock_api.Product.retrieve.side_effect = None
        be.create_product()

        mock_api.Product.retrieve.assert_called_once_with("product_abc")
        mock_api.Product.create.assert_not_called()

    def test_create_subscription_and_charge_card(self, mock_api):
        be = StripeBackend()
        be._product_id = Mock(return_value="product_abc")
        mock_api.Plan.retrieve.side_effect = Exception("plannotfound")

        customer = Mock()
        customer.id = "stripe_customer"

        be.create_subscription_and_charge_card(
            customer, 2.13, "quarterly", "usd", "friends"
        )
        expected_plan_id = "donate_2.13_usd_every_3_months"
        mock_api.Plan.retrieve.assert_called_once_with(expected_plan_id)
        mock_api.Plan.create.assert_called_once_with(
            id=expected_plan_id,
            amount=213,
            interval="month",
            interval_count=3,
            product="product_abc",
            currency="usd",
            metadata={"description": "friends"},
        )

        item = Mock()
        item.plan = expected_plan_id

        mock_api.Subscription.create.assert_called_once_with(
            customer=customer.id, items=[{"plan": expected_plan_id}]
        )

        mock_api.Plan.retrieve.side_effect = None
        mock_api.Plan.retrieve.reset_mock()
        mock_api.Plan.create.reset_mock()

        be.create_subscription_and_charge_card(
            customer, 2.13, "quarterly", "usd", "friends"
        )
        mock_api.Plan.retrieve.assert_called_once_with(expected_plan_id)
        mock_api.Plan.create.assert_not_called()

    def test_subscriptions_by_customer_id(self, mock_api):
        subscription = Mock()
        subscription.data = "data"

        be = StripeBackend()
        mock_api.Subscription.list.return_value = subscription
        assert be.subscriptions_by_customer_id("stripe_customer") == "data"
        mock_api.Subscription.list.assert_called_once_with(
            customer="stripe_customer", status="all"
        )

    def test_checksum_from_subscription(self):
        customer = Mock()
        customer.id = "customer_id"

        subscription = Mock()
        subscription.id = "subscription_id"
        subscription.customer = customer

        assert (
            checksum_from_subscription(subscription)
            == "bjjq934TMFTxZKj863KfpEwJ43FHUeKjda3XWQk22Kc"
        )

        with pytest.raises(Exception):
            verify_checksum("123", "customer", "subscription_id")

        try:
            verify_checksum(
                "bjjq934TMFTxZKj863KfpEwJ43FHUeKjda3XWQk22Kc",
                customer.id,
                subscription.id,
            )
        except:
            pytest.fail("Verify checksum should not throw on correct checksum")
