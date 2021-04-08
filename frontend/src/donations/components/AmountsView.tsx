import classnames from 'classnames';
import jQuery from 'jquery';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useFormStateContext } from 'react-form-state-context';
import { AmountButton } from 'src/donations/components/AmountButton';
import { CurrencyPicker } from 'src/donations/components/CurrencyPicker';
import { DesignationField } from 'src/donations/components/DesignationField';
import { OtherAmountButton } from 'src/donations/components/OtherAmountButton';
import { Recurrences } from 'src/donations/components/Recurrences';
import { md_mb, style, xs_mb, xs_mr } from 'src/donations/utils/style';
import { getCurrency } from 'src/donations/constants';
import { OptionsT } from 'src/donations/types';
import { useDonationState } from 'src/donations/useDonationState';
import './AmountsView.scss';

type PropsT = {
  options: OptionsT;
};

export const AmountsView: React.FC<PropsT> = observer((props: PropsT) => {
  const formState = useFormStateContext();
  const donationState = useDonationState();
  const [usePresetAmount, setUsePresetAmount] = React.useState(true);

  const _next = () => {
    donationState.goFromAmountsViewToCreditCardView(formState);
  };

  const NextButton = (
    <button className={classnames('NextButton')} onClick={_next}>
      {formState.values.recurrence === 'monthly' ? 'DONATE MONTHLY' : 'DONATE'}
    </button>
  );

  const currency = getCurrency(formState.values.currency);

  const _createAmountNodes = () => {
    var amountData = [50, 100, 200];
    return amountData.map((amount) => {
      return (
        <AmountButton
          isSelected={formState.values.amount === amount && usePresetAmount}
          onAmountSelected={() => {
            formState.setValue('amount', amount);
            setUsePresetAmount(true);
            jQuery('#otherAmountButton').val('');
          }}
          key={amount}
          currency={currency}
          recurrence={formState.values.recurrence}
          amount={amount}
          className=""
        />
      );
    });
  };

  const amountNodes = _createAmountNodes();

  return (
    <div className="AmountsView flex flex-col items-center">
      <Recurrences
        style={style(md_mb)}
        recurrenceOptions={props.options.recurrenceOptions}
      />
      <div style={style(xs_mb)} className="flex flex-row w-full">
        <CurrencyPicker />
        <div style={style(xs_mr)} />
        {amountNodes[0]}
        <div style={style(xs_mr)} />
        {amountNodes[1]}
      </div>
      <div style={style(md_mb)} className="flex flex-row w-full">
        {amountNodes[2]}
        <div style={style(xs_mr)} />
        <OtherAmountButton
          currency={currency}
          usePresetAmount={usePresetAmount}
          setUsePresetAmount={setUsePresetAmount}
          onEnter={() => _next()}
        />
      </div>
      {props.options.designationOptions.length > 0 && (
        <div style={style(md_mb)} className="flex flex-row w-full">
          <DesignationField options={props.options} />
        </div>
      )}
      {NextButton}
    </div>
  );
});
