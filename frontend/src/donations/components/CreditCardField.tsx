import React from 'react';
import { observer } from 'mobx-react-lite';
import InputMask from 'react-input-mask';
import jQuery from 'jquery';
import classnames from 'classnames';
import { Field } from 'src/forms/components/Field';
import { ContactInfoField } from 'src/donations/components/ContactInfoField';
import { useFormStateContext } from 'react-form-state-context';

import './CreditCardField.scss';

const lastDigits = (value: string) => {
  const parts = value.split(' ');
  return parts.length === 4 ? parts[parts.length - 1] : '';
};

export const CreditCardField = observer(() => {
  const [isFocussedOnCard, setIsFocussedOnCard] = React.useState(true);
  const formState = useFormStateContext();

  return (
    <Field fieldName="creditCardNumber">
      <div className={classnames('flex')}>
        <InputMask
          value={
            isFocussedOnCard
              ? formState.values.creditCardNumber ?? ''
              : lastDigits(formState.values.creditCardNumber ?? '')
          }
          onFocus={() => setIsFocussedOnCard(true)}
          onChange={(e: any) => {
            formState.setValue('creditCardNumber', e.target.value);
          }}
          maskPlaceholder=""
          placeholder="Credit Card Number"
          mask={isFocussedOnCard ? '9999 9999 9999 9999' : '9999'}
          className={classnames(
            'CreditCardNumber',
            isFocussedOnCard ? 'w-72' : 'w-48'
          )}
        ></InputMask>
        <Field fieldName="creditCardExpireMonth">
          <ContactInfoField
            onFocus={() => setIsFocussedOnCard(false)}
            isAutoComplete={false}
            maxLength={2}
            placeholder="MM"
            className="CreditCardExpireField"
            onChange={(e) => {
              if (
                ['2', '3', '4', '5', '6', '7', '8', '9'].includes(
                  e.target.value
                )
              ) {
                e.target.value = '0' + e.target.value;
              }
              if (e.target.value.length === 2) {
                jQuery('#creditCardExpireYear').trigger('focus');
              }
            }}
          />
        </Field>
        <Field fieldName="creditCardExpireYear">
          <ContactInfoField
            id="creditCardExpireYear"
            onFocus={() => setIsFocussedOnCard(false)}
            isAutoComplete={false}
            maxLength={2}
            placeholder="YY"
            className="CreditCardExpireField"
            onChange={(e) => {
              if (/[0-9]{2}/.test(e.target.value)) {
                jQuery('#creditCardSecurityCode').trigger('focus');
              }
            }}
          />
        </Field>
        <Field fieldName="creditCardSecurityCode">
          <ContactInfoField
            id="creditCardSecurityCode"
            onFocus={() => setIsFocussedOnCard(false)}
            isAutoComplete={false}
            maxLength={3}
            placeholder={isFocussedOnCard ? '' : 'CVC'}
            className={classnames(
              'CreditCardSecurityCode',
              isFocussedOnCard ? 'w-8' : 'w-32',
              {
                'CreditCardSecurityCode--hidden': isFocussedOnCard,
              }
            )}
          />
        </Field>
      </div>
    </Field>
  );
});
