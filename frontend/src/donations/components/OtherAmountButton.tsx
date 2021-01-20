import classnames from 'classnames';
import jQuery from 'jquery';
import { useFormStateContext } from 'react-form-state-context';
import { Field } from 'src/forms/components/Field';
import { CurrencyT } from 'src/donations/types';
import { getCurrencyStr } from 'src/donations/constants';

import './OtherAmountButton.scss';

type PropsT = {
  currency: CurrencyT;
  usePresetAmount: boolean;
  setUsePresetAmount: Function;
  onEnter: Function;
};

export const OtherAmountButton = (props: PropsT) => {
  const formState = useFormStateContext();

  const buttonNotSelected = (
    <div
      className={classnames(`OtherAmountButton flex items-center`, {
        'OtherAmountButton--notSelected': true,
      })}
      onClick={() => props.setUsePresetAmount(false)}
    >
      <div className="flex flex-row items-baseline flex-grow">Other amount</div>
    </div>
  );

  const buttonSelected = (
    <Field fieldName="amount">
      <div
        className={classnames('OtherAmountButton', 'flex', 'items-center', {
          'OtherAmountButton--selected': !props.usePresetAmount,
          'OtherAmountButton--notSelected': props.usePresetAmount,
        })}
        onClick={() => {
          jQuery('#otherAmountButton').trigger('focus');
        }}
      >
        <div className="OtherAmount__currencySymbol">
          {props.currency.symbol}
        </div>
        <input
          name="otherAmountButton"
          type="text"
          autoComplete={'off'}
          autoFocus={true}
          placeholder="Other amount"
          id="otherAmountButton"
          onFocus={() => {
            formState.setValue('amount', 0);
            props.setUsePresetAmount(false);
          }}
          onInput={(event: any) => {
            formState.setValue('amount', event.target.value);
            props.setUsePresetAmount(false);
          }}
          onKeyPress={(event) => {
            if (event.code === 'Enter') {
              event.preventDefault();
              props.onEnter();
            }
          }}
        />
        <div className="OtherAmount__currencyCode">
          {getCurrencyStr(props.currency, formState.values.recurrence)}
        </div>
      </div>
    </Field>
  );

  return props.usePresetAmount ? buttonNotSelected : buttonSelected;
};
