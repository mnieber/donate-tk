import { makeObservable, observable, action } from 'mobx';
import { FormState } from 'react-form-state-context';
import { CarouselHeaderT } from 'src/donations/types';
import { getStripeToken, sendDonationForm } from 'src/donations/api';

export class DonationState {
  carouselHeader: CarouselHeaderT = 'Address';
  isSendingForm: boolean = false;
  isPaymentReceived: boolean = false;
  statusCode: number = 0;
  fatalServerErrorMsg?: string = undefined;

  constructor() {
    makeObservable(this, {
      carouselHeader: observable,
      isSendingForm: observable,
      isPaymentReceived: observable,
      statusCode: observable,
      goToAmountView: action,
      goFromAddressViewToCreditCardView: action,
      goFromAmountsViewToCreditCardView: action,
      submitForm: action,
    });
  }

  goToAmountView() {
    this.carouselHeader = 'Amount';
  }

  goFromAddressViewToCreditCardView() {
    if (this.carouselHeader !== 'Address') {
      console.warn('Expected to be in the Address view');
    }
    this.carouselHeader = 'CreditCard';
  }

  goFromAmountsViewToCreditCardView(formState: FormState) {
    if (this.carouselHeader !== 'Amount') {
      console.warn('Expected to be in the Amount view');
    }

    if (formState.validate({ fieldNames: ['amount'] })) {
      this.carouselHeader = 'CreditCard';
    }
  }

  goFromCreditCardViewToAddressView(formState: FormState) {
    if (this.carouselHeader !== 'CreditCard') {
      console.warn('Expected to be in the CreditCard view');
    }

    if (
      formState.validate({
        fieldNames: [
          'creditCardNumber',
          'creditCardSecurityCode',
          'creditCardExpireMonth',
          'creditCardExpireYear',
          'email',
          'firstName',
          'lastName',
        ],
      })
    ) {
      this.carouselHeader = 'Address';
    }
  }

  submitForm(formState: FormState) {
    const isValid = formState.validate();
    if (!isValid) {
      return;
    }

    const { values } = formState;

    this.isSendingForm = true;
    this.fatalServerErrorMsg = undefined;
    this.statusCode = 0;

    getStripeToken({
      firstName: values.firstName,
      lastName: values.lastName,
      creditCardNumber: values.creditCardNumber,
      creditCardSecurityCode: values.creditCardSecurityCode,
      creditCardExpireMonth: values.creditCardExpireMonth,
      creditCardExpireYear: values.creditCardExpireYear,
    })
      .catch(() => {
        formState.setError(
          'creditCardNumber',
          'We could not identify your card, please check the number'
        );
      })
      .then((response: any) => {
        const stripeToken = response['id'];
        return sendDonationForm(
          {
            amount: values.amount,
            email: values.email,
            recurrence: values.recurrence,
            currency: values.currency,
            description: `Designation: ${values.designation ?? 'any'}`,
          },
          stripeToken
        );
      })
      .then(
        action(() => {
          this.isPaymentReceived = true;
          this.carouselHeader = 'Finish';
        })
      )
      .catch(
        action((error: any) => {
          const data = error.responseJSON.data;
          const errorCode = data.error_code;

          this.isPaymentReceived = false;
          this.statusCode = error.status;

          if (
            errorCode === 'CARD_DECLINED' ||
            errorCode === 'ZIP_CODE_FAILED_VALIDATION' ||
            errorCode === 'CARD_EXPIRED' ||
            errorCode === 'ERROR_PROCESSING_CARD'
          ) {
            formState.setError('creditCardNumber', data.error_msg);
            this.carouselHeader = 'CreditCard';
          } else if (errorCode === 'ZIP_CODE_FAILED_VALIDATION') {
            formState.setError('zipCode', data.error_msg);
            this.carouselHeader = 'Address';
          } else {
            this.fatalServerErrorMsg = data.error_msg;
            this.carouselHeader = 'Finish';
          }
        })
      )
      .always(
        action(() => {
          this.isSendingForm = false;
        })
      );
  }
}
