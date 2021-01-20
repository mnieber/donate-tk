import { observer } from 'mobx-react-lite';
import { useFormStateContext } from 'react-form-state-context';
import { useDonationState } from 'src/donations/useDonationState';
import { OptionsT } from 'src/donations/types';
import { sm_mb, style } from 'src/donations/utils/style';
import './FinishView.scss';

const ThankYou = observer(({ options }: { options: OptionsT }) => {
  const formState = useFormStateContext();
  const email = formState.values.email;

  return (
    <div style={style(sm_mb)} className="text-center">
      <h1>Thank you!</h1>
      <br />
      Your donation makes a difference.
      <br />
      {options.thankYouMessage}
      <br />
      {`You'll receive a donation receipt via email to ${email}`}
    </div>
  );
});

type PropsT = {
  options: OptionsT;
};

export const FinishView: React.FC<PropsT> = observer((props: PropsT) => {
  const donationState = useDonationState();

  const ErrorMessage = (
    <div className="">
      <h1 style={style(sm_mb)} className={'text-center'}>
        {donationState.statusCode === 500 && 'Oops!'}
        {donationState.statusCode !== 500 && 'Sorry, there was a problem'}
      </h1>
      <div style={style(sm_mb)}>{donationState.fatalServerErrorMsg}</div>
    </div>
  );

  const BackButton = (
    <button
      className={'FinishView__BackButton self-center'}
      onClick={(event) => {
        event.preventDefault();
        donationState.goToAmountView();
      }}
    >
      Back
    </button>
  );

  return (
    <div className="flex flex-col items-center mx-4">
      {!donationState.isPaymentReceived && ErrorMessage}
      {donationState.isPaymentReceived && <ThankYou options={props.options} />}
      {BackButton}
    </div>
  );
});
