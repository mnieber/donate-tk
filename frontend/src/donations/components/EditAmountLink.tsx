import { useFormStateContext } from 'react-form-state-context';
import { getCurrency } from 'src/donations/constants';
import { useDonationState } from 'src/donations/useDonationState';
import { sm_mb, style } from 'src/donations/utils/style';

export const EditAmountLink = () => {
  const donationState = useDonationState();
  const formState = useFormStateContext();

  const currency = getCurrency(formState.values.currency);

  const recurrence =
    formState.values.recurrence === 'monthly' ? ' per month' : '';
  const link = (
    <button
      className={'underline self-center'}
      onClick={(event) => {
        donationState.goToAmountView();
        event.preventDefault();
      }}
    >
      edit amount
    </button>
  );
  return (
    <div
      style={style(sm_mb)}
      className={'self-center'}
      onClick={(event) => {
        donationState.goToAmountView();
        event.preventDefault();
      }}
    >
      {`Donate ${
        formState.values.amount
      } ${currency.code.toUpperCase()}${recurrence} (`}
      {link}
      {`)`}
    </div>
  );
};
