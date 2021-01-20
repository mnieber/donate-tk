import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import { useFormStateContext } from 'react-form-state-context';
import { Field } from 'src/forms/components/Field';
import { ContactInfoField } from 'src/donations/components/ContactInfoField';
import { CreditCardField } from 'src/donations/components/CreditCardField';
import { md_mb, sm_mb, style } from 'src/donations/utils/style';
import type { OptionsT } from 'src/donations/types';
import { useDonationState } from 'src/donations/useDonationState';
import { EditAmountLink } from 'src/donations/components/EditAmountLink';
import './CreditCardView.scss';

type PropsT = {
  options: OptionsT;
};

const EmailField = () => {
  return (
    <Field fieldName="email">
      <ContactInfoField
        isAutoComplete={true}
        placeholder="Email address"
        className="EmailField"
      />
    </Field>
  );
};

const FirstNameField = () => {
  return (
    <Field fieldName="firstName">
      <ContactInfoField
        isAutoComplete={true}
        placeholder="First name"
        className="FirstNameField"
      />
    </Field>
  );
};

const LastNameField = () => {
  return (
    <Field fieldName="lastName">
      <ContactInfoField
        isAutoComplete={true}
        placeholder="Last name"
        className="LastNameField"
      />
    </Field>
  );
};

export const CreditCardView: React.FC<PropsT> = observer((props: PropsT) => {
  const donationState = useDonationState();
  const formState = useFormStateContext();

  const NextButton = (
    <button
      className={classnames('NextButton')}
      disabled={(formState.values.amount ?? 0) < 1}
      onClick={(event: any) => {
        event.preventDefault();
        donationState.goFromCreditCardViewToAddressView(formState);
      }}
    >
      Next Step
    </button>
  );

  return (
    <div
      className={classnames('CreditCardView', 'flex', 'flex-col', 'flex-wrap')}
    >
      <div className={'flex justify-center w-full'}>
        <EditAmountLink />
      </div>
      <div style={style(sm_mb)} className={'flex justify-center w-full'}>
        <FirstNameField />
        <LastNameField />
      </div>
      <div style={style(sm_mb)} className={'flex justify-center w-full'}>
        <EmailField />
      </div>
      <div style={style(md_mb)} className={'flex justify-center w-full'}>
        <CreditCardField />
      </div>
      <div className={'flex justify-center w-full'}>{NextButton}</div>
    </div>
  );
});
