.. _django_app:


Stripe testing keys
===================

Register at Stripe via https://stripe.com/register (it takes only
a minute) and copy your test keys from the dashboard.


The Django app
==============

Below is a description of the different components of the DonateTk Django App. This app can
be used as is, though you need to supply some configuration settings. See :ref:`_installation`
for details about how to try it out.


DonationsView
-------------

This view processes one-time and recurruring donations. It currently only supports Stripe as the
payment provider.


Route
~~~~~

* url: /api/donations
* method: POST


Query parameters
~~~~~~~~~~~~~~~~

* `email`
* `stripe_token`
* `recurrence` (possible values are: "once", "monthly", "quarterly" or "annually")
* `currency` (possible values are: "usd" or "eur")
* `amount` (in 100 cent units, so `amount=5` and `currency=usd` implies a donation of 5 dollar or 500 dollar-cent)
* `description`


Response
~~~~~~~~

* `success` (flag)
* `status` (HTTP status code)
* `data`. This is a dictionary that (in case of errors) has an error_code member with possible values:
    * CARD_DECLINED
    * ZIP_CODE_FAILED_VALIDATION
    * CVC_FAILED_VALIDATION
    * CARD_EXPIRED
    * ERROR_PROCESSING_CARD
    * AMOUNT_BELOW_MINIMUM (returned when the amount is below 1)
    * INVALID_QUERY_PARAMS (query params are checked with pydantic)
    * UNKNOWN


Description
~~~~~~~~~~~

The view uses the following steps:

1. get or create the stripe customer for the given email
2. get or create a stripe source for the given stripe token
3. create a stripe subscription if the donation is recurring.
4. create a stripe charge if the donation is not recurring but one-time
5. send a signal (`signals.subscription_created` or `signals.charge_created`) so that other Django
   apps can take custom actions
6. send a donation confirmation email


DonationView
------------

This view is used to cancel a donation.


Route
~~~~~

* url: /api/donation/:customer_id/:subscription_id
* method: DELETE


Response
~~~~~~~~

* `status`: Possible values are:
    * 200
    * 400 (if the checksum is not valid)
    * 404 (if the stripe subscription was not found)


StripeWebhookView
-----------------

This view can be connected to the Stripe Webhook. It does not do useful work but it provided as
an example in case you need to respond to stripe events.


StripeBackend
-------------

This class makes the required calls to the stripe API. It creates the following stripe entities (see
the source code for details):

* customer
* charge
* source
* plan
* subscription
* product


Required Django settings
------------------------

* DONATETK_ORG_NAME: The name of the organization used when creating the Stripe product
  and in the donation confirmation email
* DONATETK_WEBPAGE_HOST: The host address of the webpage that handles cancellation of a
  donation. This is used in the donation confirmation email.
* DONATETK_STRIPE_TEST_PUBLIC_KEY: The public stripe key used in test mode
* DONATETK_STRIPE_TEST_SECRET_KEY: The secret stripe key used in test mode
* DONATETK_STRIPE_LIVE_PUBLIC_KEY: The public stripe key used in live mode
* DONATETK_STRIPE_LIVE_SECRET_KEY: The secret stripe key used in live mode
* DONATETK_STRIPE_LIVE_MODE: the flag that determines if live mode or test mode is used

Optional Django settings
------------------------

* DONATETK_SEND_RECEIPT_EMAIL: Flag that determines if a confirmation email is sent to
  the donor. Defaults to True.
* DONATETK_MAIL_SUBJECT: The subject to use in the donation confirmation email. This is a template
  string that may use amount, currency and org_name as template variables.
* DONATETK_MAIL_MESSAGE: Similar to DONATETK_MAIL_SUBJECT, but contains the message body.
* DONATETK_MAIL_HTML_MESSAGE: Similar to DONATETK_MAIL_SUBJECT, but contains the html message body.
* DONATETK_STRIPE_ENDPOINT_SECRET: The stripe endpoint secret used in the StripeWebhookView example
