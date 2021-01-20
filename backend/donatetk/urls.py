from django.conf.urls import re_path

from donatetk.views import DonationsView, DonationView, StripeWebhookView

urlpatterns = [
    re_path(r"^donations/?", DonationsView.as_view()),
    re_path(
        r"^donation/(?P<customer_id>[^/]+)/(?P<subscription_id>[^/]+)/?",
        DonationView.as_view(),
    ),
    re_path(r"^stripe-webhook/?", StripeWebhookView.as_view()),
]
