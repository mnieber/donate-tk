import { observer } from 'mobx-react-lite';
import classnames from 'classnames';
import { useFormStateContext } from 'react-form-state-context';
import Loader from 'react-loader-spinner';
import { getCurrency } from 'src/donations/constants';
import { useDonationState } from 'src/donations/useDonationState';
import './DonateButton.scss';

export const DonateButton = observer(({ isSendingForm }: any) => {
  const formState = useFormStateContext();
  const donationState = useDonationState();
  const postfix = formState.values.recurrence === 'monthly' ? ' PER MONTH' : '';
  const currency = getCurrency(formState.values.currency);

  return (
    <div className="">
      <button
        type="submit"
        onClick={() => {
          donationState.submitForm(formState);
        }}
        className={classnames('DonateButton', {
          'pointer-events-none': isSendingForm,
        })}
      >
        {`DONATE ${currency.symbol}${formState.values.amount}${postfix}`}
        <div
          className={classnames(
            'DonateButton__Loader',
            `DonateButton__Loader--${formState.values.recurrence}`,
            {
              invisible: !isSendingForm,
            }
          )}
        >
          <Loader type="TailSpin" color="#007FBF" height={30} width={30} />
        </div>
      </button>
    </div>
  );
});
