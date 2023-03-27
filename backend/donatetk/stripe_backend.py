import stripe
from django.conf import settings

stripe.api_key = (
    settings.DONATETK_STRIPE_LIVE_SECRET_KEY
    if settings.DONATETK_STRIPE_LIVE_MODE
    else settings.DONATETK_STRIPE_TEST_SECRET_KEY
)


class StripeBackend:
    @property
    def api(self):
        """
        Get access to the underlying stripe API.

        Note that this function exists so that we can easily
        mock the stripe API in one place.
        """
        return stripe

    def get_or_create_customer_by_email(self, email):
        # get or create stripe customer with this email
        stripe_customers = self.api.Customer.list(email=email)
        if len(stripe_customers.data):
            return stripe_customers.data[0]
        return self.api.Customer.create(email=email)

    def get_customer_by_id(self, customer_id):
        return self.api.Customer.retrieve(customer_id)

    def _cents(self, amount):
        return int(float(amount) * 100)

    def create_charge(self, stripe_customer, amount, source, currency, description):
        return self.api.Charge.create(
            amount=self._cents(amount),
            currency=currency,
            customer=stripe_customer.id,
            source=source.id,
            description=description,
        )

    def _product_id(self):
        org_name = settings.DONATETK_ORG_NAME.lower().replace(" ", "_")
        return f"donation_through_the_{org_name}_donation_page"

    def cancel_cards(self, stripe_customer):
        for source in stripe_customer.sources:
            source.delete()

    def _get_interval_count(self, recurrence):
        counts = dict(monthly=1, quarterly=3, annually=12)
        return counts[recurrence.lower()]

    def _plan_id(self, amount, recurrence, currency):
        interval_count = self._get_interval_count(recurrence)
        return (
            ("donate_{amount}_{currency}_every_{interval_count}_months")
            .format(amount=amount, currency=currency, interval_count=interval_count)
            .lower()
        )

    def create_product(self):
        try:
            self.api.Product.retrieve(self._product_id())
        except:
            self.api.Product.create(
                id=self._product_id(),
                name="Donation to %s" % settings.DONATETK_ORG_NAME,
            )

    def create_subscription_and_charge_card(
        self, stripe_customer, amount, recurrence, currency, description
    ):
        """
        Note that:
        - the first donation happens when the subscription is created (really??)
        - we must check if the plan already exists. Creating a duplicate plan
        will crash
        """
        plan_id = self._plan_id(amount, recurrence, currency)
        try:
            self.api.Plan.retrieve(plan_id)
        except:
            self.api.Plan.create(
                id=plan_id,
                amount=self._cents(amount),
                interval="month",
                interval_count=self._get_interval_count(recurrence),
                product=self._product_id(),
                currency=currency,
                metadata=dict(description=description),
            )

        # subscribe customer to this plan
        return self.api.Subscription.create(
            customer=stripe_customer.id, items=[dict(plan=plan_id)]
        )

    def subscriptions_by_customer_id(self, stripe_customer_id):
        return self.api.Subscription.list(
            customer=stripe_customer_id, status="all"
        ).data
