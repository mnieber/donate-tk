from django.conf.urls import re_path
from django.views.decorators.csrf import csrf_exempt

from donatetk.views import DonationsView, DonationView, StripeWebhookView

urlpatterns = [
    re_path(r"^donations/?", csrf_exempt(DonationsView.as_view())),
    re_path(
        r"^donation/(?P<customer_id>[^/]+)/(?P<subscription_id>[^/]+)/?",
        csrf_exempt(DonationView.as_view()),
    ),
    re_path(r"^stripe-webhook/?", StripeWebhookView.as_view()),
]
