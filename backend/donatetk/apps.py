import sys

from django.apps import AppConfig
from django.conf import settings
from django.core.exceptions import ImproperlyConfigured
from donatetk.views import StripeBackend


class DonationTkConfig(AppConfig):
    name = "donatetk"

    def ready(self):
        is_not_testing = "pytest" not in sys.modules
        is_maybe_testing = "pytest" in sys.modules

        if is_maybe_testing and not settings.DEBUG:
            raise ImproperlyConfigured(
                "The system is probably misconfigured, because "
                + "pytest was imported while DEBUG is False"
            )

        if is_not_testing:
            stripe_api = StripeBackend()
            stripe_api.create_product()
