.. _react_app:

The React application
=====================

Below we discuss the various parts of the react frontend. The corresponding files can be found
in `src/frontend/donations`. Only an overview of the code structure is
given, you are encouraged to check out the source code for details. There are four scenarios to reuse
the frontend code (in order of increasing reuse):

1. Api level. In this case you use `api.ts` to communicate to the backend and
   implement all other concerns for showing and processing the donation form yourself.
2. Form state level. In this case you use a `FormStateProvider` (that comes
   from the `react-form-state-context` library) to store the donation form values and
   use the `validation.ts` module to validate them. After validation, the form values
   can be passed to the `api.ts` module in order to send the donation to the backend.
   Use this option if you want to implement a custom workflow for filling in the donation form.
3. Donation state level. You may additionally use the `DonationState` class to track the state of the
   current donation. This class tracks all information related to the current donation (e.g. which
   part of the donation form is currently shown, and whether the donation has been received
   by the backend). It contains a `submitForm` function that sends the form values to the backend and
   updates the donation state based on the response. Use this option if you want to use the default
   donation workflow with your own visual components.
4. Visual component level. You may reuse the `DonationFormView` component directly, and update the
   `scss` stylesheets to integrate the component into your website. Note that the `DonationFormView`
   component is only concerned with rendering issues, it uses `DonationState` as a data layer. Note that
   if you don't intend to reuse the visual components then you can ignore the `components` directory.

In addition, the frontend code contains a UrlRouter and CancelDonationView that are not very
suitable to be reused directly, but that can serve as a starting point for your own implementation.

Note that the excellent MobX library is used for state management in scenarios 3 and 4, so if
you dislike this choice, then you should fall back to scenario 1 or 2 and use the rest of the code
as inspiration only.


The api.ts module
-----------------

This module receives the validated form values.

Functions
~~~~~~~~~

* getStripeToken. This function uses the following form values: firstName, lastName,
  creditCardNumber, creditCardSecurityCode, creditCardExpireMonth and creditCardExpireYear.
  It returns a stripe token.

* sendDonationForm. This function sends the donation form (and the stripe token) to the backend.
  It uses the following form values: email, amount, currency, recurrence and description,

* cancelDonation. This function cancels a recurring donation. It takes the customerId,
  subscriptionId and checksum (see UrlRouter above) as its arguments.


The validation.ts module
-----------------

This module is used to check the validatity of the various form fields.

Functions
~~~~~~~~~

* `handleValidate`: a validation function that can be used in the `FormStateProvider`.


The DonationState.ts module
---------------------------

This module defines the `DonationState`.

Fields
~~~~~~

* carouselHeader: the current sub-view within the `DonationFormView`
* isSendingForm
* isPaymentReceived (set to true if the donation was successfully processed by the backend)
* statusCode (the status code returned by the backend)

Functions
~~~~~~~~~

- goFrom<Some>ViewTo<SomeOther>View. These are functions that change the current carouselHeader.
  Depending on the transition, it may perform partial validation of the form, based on the fields that are
  expected to be filled out at that point.
- `submitForm`. This is a function that sends the donation form values to the backend and
  updates the donation state based on the response.


The useDonationState.ts module
---------------------------

This module contains a React hook that provides the current DonationState instance.


The DonationFormView component
------------------------------

This component shows the donation form. It uses the `react-form-state-context` library for form
processing, and `useDonationState` to access the current donation state.


The types.ts module
-------------------

This module contains various types that are used in the frontend. Notably, the `CurrencyT`
type lists the currencies that are supported (currently only USD and EUR). It also
contains the `OptionsT` which is used to customize the `DonationFormView`.


The UrlRouter
-------------

The react application has a url router that serves the `/donate/page` route (for showing the
donation form) and the `/donate/cancel` route (for cancelling a recurring donation). The
`/donate/cancel` route takes the stripe customer_id and subscription_id as route parameters,
and a checksum as a query parameter (this checksum is generated by the backend when it creates
the link to cancel a donation).
