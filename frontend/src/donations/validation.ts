import creditCardChecker from 'card-validator';
import { HandleValidateArgsT } from 'react-form-state-context';

export function isValidAmount(
  value: string,
  minDonationAmount: number,
  currency: string
) {
  if (!parseInt(value)) {
    return 'Please enter a valid amount';
  }
  if (parseInt(value) < minDonationAmount) {
    return `The minimum amount is ${minDonationAmount} ${currency.toUpperCase()}`;
  }
  return undefined;
}

export function isValidSecurityCode(value: string) {
  if (!parseInt(value)) {
    return 'Please use only digits';
  }
  return undefined;
}

export function isValidCardNumber(value: string) {
  let number = creditCardChecker.number(value);
  if (!number.isValid) {
    return 'Please enter a valid card number';
  }
  return undefined;
}

export function notEmpty(value: any, fieldName?: string) {
  if (!value) {
    return fieldName
      ? `The ${fieldName} field is required`
      : 'This field is required';
  }
  return undefined;
}

export function isDefined(value: any) {
  if (value === undefined) {
    return 'This field is required.';
  }
  return undefined;
}

export function notZero(value: any, fieldName?: string) {
  if (value === 0) {
    return fieldName
      ? `The ${fieldName} field is required`
      : 'This field is required';
  }
  return undefined;
}

export function isValidEmail(email: string) {
  // eslint-disable-next-line
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!re.test(email)) {
    return 'Please enter a valid email address.';
  }
  return undefined;
}

function trim(value: string) {
  if (typeof value !== 'string') {
    return value;
  }
  return value ? value.trim() : '';
}

export const handleValidate = (
  minDonationAmountByCurrency: any,
  { values, setError }: HandleValidateArgsT
) => {
  setError(
    'amount',
    isValidAmount(
      values.amount,
      minDonationAmountByCurrency[values.currency],
      values.currency
    )
  );

  for (const fieldName of ['firstName', 'lastName']) {
    setError(fieldName, notEmpty(trim(values[fieldName])));
  }

  setError('email', isValidEmail(values.email));
  setError(
    'creditCardNumber',
    isValidCardNumber(values.creditCardNumber) ??
      isValidSecurityCode(values.creditCardSecurityCode) ??
      notZero(parseInt(values.creditCardExpireMonth), 'expiration') ??
      notZero(parseInt(values.creditCardExpireYear), 'expiration')
  );

  for (const fieldName of ['streetAddress', 'city', 'zipCode']) {
    setError(fieldName, notEmpty(trim(values[fieldName])));
  }
  setError('country', isDefined(values.country));
};
