from django.conf import settings
from django.http import JsonResponse
from django.views import View

from donatetk import signals
from donatetk.utils.money import to_100_cents_unit
from donatetk.views.utils import create_stripe_backend


# This view is intended as an example of how to set up the stripe webhook.
# It does not do any useful work.
class StripeWebhookView(View):
    def post(self, request):
        self.stripe_be = create_stripe_backend()

        payload = request.body
        sig_header = request.META["HTTP_STRIPE_SIGNATURE"]
        event = None

        try:
            event = self.stripe_be.api.Webhook.construct_event(
                payload, sig_header, settings.DONATETK_STRIPE_ENDPOINT_SECRET
            )
        except ValueError:
            return JsonResponse(status=400)
        except self.stripe_be.api.error.SignatureVerificationError:
            return JsonResponse(status=400)

        stripe_object = event.data.object
        if stripe_object.object == "charge":
            is_refund = stripe_object.refunded == "true"
            multiplier = -1 if is_refund else 1

            signals.charge_received.send(
                self,
                total_amount=multiplier * to_100_cents_unit(stripe_object.amount),
                currency=stripe_object.currency.upper(),
            )

        return JsonResponse(dict(success=True, data={}), status=200)
