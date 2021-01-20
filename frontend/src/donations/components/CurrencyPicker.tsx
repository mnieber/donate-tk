import classnames from 'classnames';
import { useFormStateContext } from 'react-form-state-context';
import Constants from 'src/donations/constants';
import { CurrencyT } from 'src/donations/types';

import './CurrencyPicker.scss';

type PropsT = {};

export const CurrencyPicker: React.FC<PropsT> = (props: PropsT) => {
  const formState = useFormStateContext();

  function createCurrencyOptions() {
    return Constants.currencies.map((currency: CurrencyT) => {
      return (
        <option value={currency.code} key={currency.code}>
          {`${currency.symbol} ${currency.code.toUpperCase()}`}
        </option>
      );
    });
  }

  return (
    <div className={'CurrencyPicker__wrapper'}>
      <div className={classnames('CurrencyPicker', 'flex')}>
        <select
          name="currency"
          defaultValue={formState.values['currency']}
          onChange={(event) => {
            formState.setValue('currency', event.target.value);
          }}
        >
          {createCurrencyOptions()}
        </select>
      </div>
    </div>
  );
};
