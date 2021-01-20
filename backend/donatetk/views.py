import logging
from datetime import datetime
from enum import Enum

from django.conf import settings
from django.core.mail import send_mail
from django.core.signing import BadSignature
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from rest_framework.views import APIView

from donatetk import signals
from donatetk.stripe_backend import StripeBackend
from donatetk.utils import get_post_data


class ErrorCodes(Enum):
    CARD_DECLINED = 1
    ZIP_CODE_FAILED_VALIDATION = 2
    CVC_FAILED_VALIDATION = 3
    CARD_EXPIRED = 4
    ERROR_PROCESSING_CARD = 5
    AMOUNT_BELOW_MINIMUM = 6
    UNKNOWN = 999


def _to_100_cents_unit(amount):
    return int(amount) / 100


def _create_stripe_backend():
    return StripeBackend()


class DonationsView(APIView):
    def _describe_subscription(self, subscription):
        months_to_interval = {1: "month", 3: "quarter", 12: "year"}
        interval_count = subscription.plan.interval_count
        interval = months_to_interval[interval_count]

        amount = _to_100_cents_unit(subscription.plan.amount)
        currency = subscription.plan.currency
        when = datetime.fromtimestamp(subscription.start).strftime("%A %d. %B %Y")

        return (
            "<li>\n"
            + "{amount} {currency} per {interval} since {when}. "
            + "You can cancel this donation by visiting "
            + '<a href="{link}"/>this link</a>\n'
            + "</li>\n"
        ).format(
            when=when,
            amount=amount,
            currency=currency.upper(),
            interval=months_to_interval[interval_count],
            link=self._cancel_donation_link(subscription, currency, amount, interval),
        )

    def _send_receipt(self, email, amount, currency, subscriptions):
        donation_overview = ""
        if subscriptions:
            donation_overview += (
                "<p>"
                + "You are donating the following amounts to {org_name}:"
                + "</p>\n"
                + "<ul>\n"
            )
            for subscription in subscriptions:
                donation_overview += self._describe_subscription(subscription)
            donation_overview += (
                "</ul>\n"
                + "<p>\n"
                + "Clicking the link will take you to a page where the donation can be cancelled. "
                + "Our work depends on donations, and we really appreciate your support!"
                "</p>\n"
            )

        subject = "Your donation to {org_name}"
        html_message = (
            "<div>\n"
            + f"<p>Thank you for your donation of {amount} {currency}!</p>"
            + donation_overview
            + "</div>\n"
        )

        message = f"Thank you for your donation of {amount} {currency}!"

        format_args = dict(
            amount=amount,
            currency=currency.upper(),
            org_name=settings.DONATETK_ORG_NAME,
        )

        send_mail(
            getattr(settings, "DONATETK_MAIL_SUBJECT", subject).format(**format_args),
            getattr(settings, "DONATETK_MAIL_MESSAGE", message).format(**format_args),
            settings.EMAIL_REPLY_ADDRESS,
            [email],
            fail_silently=True,
            html_message=getattr(
                settings, "DONATETK_MAIL_HTML_MESSAGE", html_message
            ).format(**format_args),
        )

    def _cancel_donation_link(self, subscription, currency, amount, interval):
        checksum = self.stripe_be.checksum_from_subscription(subscription)
        return (
            "{host}/donate/cancel/{customer_id}/{subscription_id}/"
            + "?checksum={checksum}&amount={amount}&currency={currency}&interval={interval}"
        ).format(
            host=settings.DONATETK_WEBPAGE_HOST,
            customer_id=subscription.customer,
            subscription_id=subscription.id,
            checksum=checksum,
            amount=amount,
            currency=currency,
            interval=interval,
        )

    def post(self, request):
        self.stripe_be = _create_stripe_backend()

        if int(self.request.data["amount"]) < 1:
            return Response(
                dict(
                    success=False,
                    data=dict(error_code=ErrorCodes.AMOUNT_BELOW_MINIMUM.name),
                ),
                status=400,
            )

        email = self.request.data["email"]
        stripe_customer = self.stripe_be.get_or_create_customer_by_email(email)

        # get fingerprint of the posted credit card
        token = self.stripe_be.api.Token.retrieve(request.data["stripe_token"])
        source = None
        for existing_source in stripe_customer.sources:
            if existing_source.fingerprint == token.card.fingerprint:
                source = existing_source

        # create new source if necessary
        try:
            source = source or stripe_customer.sources.create(
                source=self.request.data["stripe_token"]
            )

            is_recurring = self.request.data["recurrence"].lower() != "once"

            if is_recurring:
                # create a subscription for the next donations
                # note that in this case no source should be indicated
                subscription = self.stripe_be.create_subscription_and_charge_card(
                    stripe_customer,
                    self.request.data["amount"],
                    self.request.data["recurrence"],
                    self.request.data["currency"],
                    self.request.data["description"],
                )
                signals.subscription_created.send(
                    self, customer=stripe_customer, subscription=subscription
                )
            else:
                # charge the customer's credit card
                charge = self.stripe_be.create_charge(
                    stripe_customer,
                    self.request.data["amount"],
                    source,
                    self.request.data["currency"],
                    self.request.data["description"],
                )
                signals.charge_created.send(
                    self, customer=stripe_customer, charge=charge
                )
        except self.stripe_be.api.error.CardError as e:
            err = e.json_body["error"]["message"]
            error_code = (
                ErrorCodes.CARD_DECLINED
                if (
                    "Your card was declined" in err
                    or "Your card has insufficient funds" in err
                )
                else ErrorCodes.ZIP_CODE_FAILED_VALIDATION
                if "The zip code you supplied failed validation" in err
                else ErrorCodes.CVC_FAILED_VALIDATION
                if "Your card's security code is incorrect" in err
                else ErrorCodes.CARD_EXPIRED
                if "Your card has expired" in err
                else ErrorCodes.ERROR_PROCESSING_CARD
                if "An error occurred while processing your card" in err
                else ErrorCodes.UNKNOWN
            )

            return Response(
                dict(success=False, data=dict(error_code=error_code.name)), status=400
            )

        is_send_mail = getattr(settings, "DONATETK_SEND_RECEIPT_EMAIL", True)
        if is_send_mail:
            self._send_receipt(
                email,
                self.request.data["amount"],
                self.request.data["currency"],
                [
                    x
                    for x in self.stripe_be.subscriptions_by_customer_id(
                        stripe_customer.id
                    )
                    if x.status == "active"
                ],
            )

        return Response(dict(success=True, data={}), status=200)


@method_decorator(csrf_exempt, name="dispatch")
class DonationView(APIView):
    def delete(self, request, customer_id, subscription_id):
        POST, _ = get_post_data(request)
        stripe_be = _create_stripe_backend()
        checksum = POST["checksum"]

        try:
            stripe_be.verify_checksum(checksum, customer_id, subscription_id)
        except BadSignature:
            return Response(status=400, reason="bad checksum")

        subscriptions = stripe_be.subscriptions_by_customer_id(customer_id)

        matching_subscriptions = [x for x in subscriptions if x.id == subscription_id]
        if not len(matching_subscriptions):
            return Response(status=404)

        subscription = matching_subscriptions[0]
        if subscription.status == "active":
            subscription.delete()
        else:
            return Response(status=404, data={})

        return Response(status=200, data={})


# This view is intended as an example of how to set up the stripe webhook.
# It does not do any useful work.
@method_decorator(csrf_exempt, name="dispatch")
class StripeWebhookView(APIView):
    def post(self, request):
        self.stripe_be = _create_stripe_backend()

        payload = request.body
        sig_header = request.META["HTTP_STRIPE_SIGNATURE"]
        event = None

        try:
            event = self.stripe_be.api.Webhook.construct_event(
                payload, sig_header, settings.DONATETK_STRIPE_ENDPOINT_SECRET
            )
        except ValueError:
            return Response(status=400)
        except self.stripe_be.api.error.SignatureVerificationError:
            return Response(status=400)

        stripe_object = event.data.object
        if stripe_object.object == "charge":
            is_refund = stripe_object.refunded == "true"
            multiplier = -1 if is_refund else 1

            signals.charge_received.send(
                self,
                total_amount=multiplier * _to_100_cents_unit(stripe_object.amount),
                currency=stripe_object.currency.upper(),
            )

        return Response(dict(success=True, data={}), status=200)
