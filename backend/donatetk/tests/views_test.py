import json
import os
from unittest.mock import MagicMock, Mock

import pytest
from django.conf import settings
from django.core import mail
from django.test import Client
from stripe.error import CardError

from donatetk.utils.checksum import checksum_from_subscription


def _data(recurrence="once"):
    return dict(
        amount=5,
        email="email@org.com",
        first_name="Maarten",
        last_name="Nieber",
        stay_in_touch="false",
        stripe_token="stripe_token",
        recurrence=recurrence,
        currency="usd",
        description="friends",
    )


class TestViews(object):
    @pytest.fixture()
    def stripe_be(self, mocker):
        mock = MagicMock()
        mock.api.error.CardError = CardError  # CardError should not be a mock
        mocker.patch(
            "donatetk.views.donationsview.create_stripe_backend", return_value=mock
        )
        mocker.patch(
            "donatetk.views.donationview.create_stripe_backend", return_value=mock
        )
        return mock

    @pytest.fixture()
    def client(self):
        return Client()

    def test_create_donation_with_new_source(self, stripe_be, client):

        new_source = Mock()

        customer = Mock()
        customer.id = "stripe_customer_123"
        customer.sources = MagicMock()
        customer.sources.create.return_value = new_source
        stripe_be.get_or_create_customer_by_email.return_value = customer

        token = Mock()
        token.card.fingerprint = "card_fingerprint"
        stripe_be.api.Token.retrieve.return_value = token

        data = _data()
        response = client.post("/api/donations/", data)

        customer.sources.create.assert_called_once_with(source="stripe_token")
        stripe_be.create_charge.assert_called_once_with(
            customer, data["amount"], new_source, "usd", "friends"
        )
        stripe_be.create_subscription_and_charge_card.assert_not_called()

        assert json.loads(str(response.content, encoding="utf8")) == dict(
            data={}, success=True
        )

    def test_create_donation_with_existing_source(self, stripe_be, client):
        source = Mock()
        source.fingerprint = "fingerprint_0"

        customer = Mock()
        customer.id = "stripe_customer_123"
        customer.sources = MagicMock()
        customer.sources.__iter__.return_value = [source]
        stripe_be.get_or_create_customer_by_email.return_value = customer

        token = Mock()
        token.card.fingerprint = source.fingerprint
        stripe_be.api.Token.retrieve.return_value = token

        data = _data()
        response = client.post("/api/donations/", data)

        customer.sources.create.assert_not_called()
        stripe_be.create_charge.assert_called_once_with(
            customer, data["amount"], source, "usd", "friends"
        )
        stripe_be.create_subscription_and_charge_card.assert_not_called()

        assert json.loads(str(response.content, encoding="utf8")) == dict(
            data={}, success=True
        )

    def test_create_recurring_donation(self, stripe_be, client):
        customer = Mock()
        customer.id = "stripe_customer_123"
        customer.sources = MagicMock()
        stripe_be.get_or_create_customer_by_email.return_value = customer

        subscription = Mock()
        subscription.id = "stripe_subscription_123"
        subscription.status = "active"
        subscription.start = 0
        subscription.customer = customer
        subscription.plan.interval_count = 3
        subscription.plan.amount = 2000
        subscription.plan.currency = "usd"
        stripe_be.create_subscription_and_charge_card.return_value = subscription
        stripe_be.subscriptions_by_customer_id.return_value = [subscription]

        data = _data("quarterly")
        assert len(mail.outbox) == 0
        response = client.post("/api/donations/", data)
        assert len(mail.outbox) == 1

        stripe_be.create_subscription_and_charge_card.assert_called_once_with(
            customer, data["amount"], "quarterly", "usd", "friends"
        )

        assert json.loads(str(response.content, encoding="utf8")) == dict(
            data={}, success=True
        )

        checksum = checksum_from_subscription(subscription)
        link = os.path.join(
            settings.DONATETK_WEBPAGE_HOST,
            "donate",
            "cancel",
            customer.id,
            subscription.id,
            f"?checksum={checksum}&amount=20.0&currency=usd&interval=quarter",
        )

        html_message = mail.outbox[0].message().get_payload()[1].as_string()
        assert link in html_message

        url = os.path.join("/api/donation", customer.id, subscription.id)
        response = client.put(
            url,
            dict(checksum=checksum),
            REQUEST_METHOD="DELETE",
            content_type="application/json",
        )
        subscription.delete.assert_called_once()
