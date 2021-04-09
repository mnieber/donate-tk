import pydantic
from django.core.signing import BadSignature
from django.http import JsonResponse
from django.views import View

from donatetk.schema import DeleteDonationParams
from donatetk.utils.checksum import verify_checksum
from donatetk.utils.requests import get_post_data, parse_params
from donatetk.views.utils import create_stripe_backend


class DonationView(View):
    def delete(self, request, customer_id, subscription_id):
        stripe_be = create_stripe_backend()
        POST, _ = get_post_data(request)
        params, error_response = parse_params(POST.dict(), DeleteDonationParams)
        if error_response:
            return error_response

        try:
            verify_checksum(params.checksum, customer_id, subscription_id)
        except BadSignature:
            return JsonResponse(status=400, reason="bad checksum")

        subscriptions = stripe_be.subscriptions_by_customer_id(customer_id)

        matching_subscriptions = [x for x in subscriptions if x.id == subscription_id]
        if not len(matching_subscriptions):
            return JsonResponse(status=404)

        subscription = matching_subscriptions[0]
        if subscription.status == "active":
            subscription.delete()
        else:
            return JsonResponse(status=404, data={})

        return JsonResponse(status=200, data={})
