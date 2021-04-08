import jQuery from 'jquery';
import { CurrencyT, RecurrenceT } from 'src/donations/types';

export function getFullName(first_name: string, last_name: string) {
  return first_name + ' ' + last_name;
}

type StripeValuesT = {
  firstName: string;
  lastName: string;
  creditCardNumber: string;
  creditCardSecurityCode: string;
  creditCardExpireMonth: string;
  creditCardExpireYear: string;
};

export function getStripeToken(values: StripeValuesT) {
  return jQuery.post('https://api.stripe.com/v1/tokens', {
    key: 'pk_test_IEOIMh1VVJvGh3jvbIk9vgUc',
    'card[name]': getFullName(values.firstName, values.lastName),
    'card[number]': values['creditCardNumber'],
    'card[cvc]': values['creditCardSecurityCode'],
    'card[exp_month]': values['creditCardExpireMonth'],
    'card[exp_year]': values['creditCardExpireYear'],
  });
}

type DonationValuesT = {
  amount: number;
  email: string;
  recurrence: RecurrenceT;
  currency: CurrencyT['code'];
  description: string;
};

export function sendDonationForm(values: DonationValuesT, stripeToken: string) {
  const url = process.env.REACT_APP_DONATIONS_API_HOST + '/api/donations';
  return jQuery
    .post(url, {
      amount: values.amount,
      email: values.email,
      recurrence: values.recurrence,
      currency: values.currency,
      description: values.description,
      stripe_token: stripeToken,
    })
    .catch((error: any) => {
      const errorCode = error.responseJSON.data?.error_code;

      const generalErrorMsg =
        'Due to a technical problem on our side, we could not process ' +
        'your donation. We hope to resolve this problem as soon as possible.';

      error.responseJSON.data.error_msg =
        !errorCode && error.status === 500
          ? generalErrorMsg
          : errorCode === 'CARD_DECLINED'
          ? 'This card was declined. If possible, please use a different card'
          : errorCode === 'CVC_FAILED_VALIDATION'
          ? 'The verification of the CVC code failed. Please check the number'
          : errorCode === 'CARD_EXPIRED'
          ? 'Your card has expired. If possible, please use a different card.'
          : errorCode === 'ERROR_PROCESSING_CARD'
          ? 'An error occurred while processing your card. Please try again later.'
          : errorCode === 'AMOUNT_BELOW_MINIMUM'
          ? 'Please enter an amount of 1 or more'
          : generalErrorMsg;

      throw error;
    });
}

export const cancelDonation = (
  customerId: string,
  subscriptionId: string,
  checksum: string
) => {
  const url =
    process.env.REACT_APP_DONATIONS_API_HOST +
    `/api/donation/${customerId}/${subscriptionId}`;
  return jQuery.ajax({
    url,
    dataType: 'json',
    data: { checksum },
    type: 'DELETE',
  });
};
