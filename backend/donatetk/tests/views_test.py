import json
from unittest.mock import MagicMock, Mock

import pytest
from django.conf import settings
from django.core import mail
from django.test import Client
from stripe.error import CardError


def _data(recurrence="Once"):
    return dict(
        amount="5",
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
        mocker.patch("donatetk.views._create_stripe_backend", return_value=mock)
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

        data = _data("Quarterly")
        response = client.post("/api/donations/", data)

        stripe_be.create_subscription_and_charge_card.assert_called_once_with(
            customer, data["amount"], "Quarterly", "usd", "friends"
        )

        assert json.loads(str(response.content, encoding="utf8")) == dict(
            data={}, success=True
        )

    def test_send_receipt(self, stripe_be, client):
        customer = Mock()
        customer.id = "stripe_customer_123"
        customer.sources = MagicMock()
        stripe_be.get_or_create_customer_by_email.return_value = customer

        assert len(mail.outbox) == 0
        client.post("/api/donations/", _data())
        assert len(mail.outbox) == 1
