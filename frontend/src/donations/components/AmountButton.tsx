import classnames from 'classnames';
import { CurrencyT, RecurrenceT } from 'src/donations/types';
import { getCurrencyStr } from 'src/donations/constants';

import './AmountButton.scss';

type AmountButtonPropsT = {
  isSelected: boolean;
  currency: CurrencyT;
  recurrence: RecurrenceT;
  amount: number;
  onAmountSelected: Function;
  className?: any;
};

export const AmountButton = (props: AmountButtonPropsT) => {
  const currencyStr = getCurrencyStr(props.currency, props.recurrence);
  return (
    <div
      className={classnames(
        `AmountButton flex items-center`,
        {
          'AmountButton--selected': props.isSelected,
          'AmountButton--notSelected': !props.isSelected,
        },
        props.className
      )}
      onClick={() => props.onAmountSelected()}
    >
      <div className="flex flex-row items-baseline flex-grow">
        <div className="text-base">{props.currency.symbol}</div>
        <div className="text-base">{props.amount}</div>
        <div className="flex-1"></div>
        <div className="text-xs">{currencyStr}</div>
      </div>
    </div>
  );
};
