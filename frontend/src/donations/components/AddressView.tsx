import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import { ContactInfoField } from 'src/donations/components/ContactInfoField';
import { CountryField } from 'src/donations/components/CountryField';
import { DonateButton } from 'src/donations/components/DonateButton';
import { EditAmountLink } from 'src/donations/components/EditAmountLink';
import { StayInTouchField } from 'src/donations/components/StayInTouchField';
import { sm_mb, style } from 'src/donations/utils/style';
import type { OptionsT } from 'src/donations/types';
import { useDonationState } from 'src/donations/useDonationState';
import { Field } from 'src/forms/components/Field';
import './AddressView.scss';

const StreetField = () => {
  return (
    <Field fieldName="streetAddress">
      <ContactInfoField
        isAutoComplete={true}
        placeholder="Billing address"
        className="StreetField"
      />
    </Field>
  );
};

const CityField = () => {
  return (
    <Field fieldName="city">
      <ContactInfoField
        isAutoComplete={true}
        placeholder="City"
        className="CityField"
      />
    </Field>
  );
};

const ZipCodeField = () => {
  return (
    <Field fieldName="zipCode">
      <ContactInfoField
        isAutoComplete={true}
        placeholder="Zip code"
        className="ZipCodeField"
      />
    </Field>
  );
};

const EditCardLink = () => {
  const donationState = useDonationState();
  return (
    <button
      className={'EditCardLink self-center'}
      onClick={(event) => {
        donationState.goFromAddressViewToCreditCardView();
        event.preventDefault();
      }}
    >
      Edit card details
    </button>
  );
};

type PropsT = {
  options: OptionsT;
};

export const AddressView: React.FC<PropsT> = observer((props: PropsT) => {
  const donationState = useDonationState();

  return (
    <div className={classnames('AddressView', 'flex', 'flex-col', 'flex-wrap')}>
      <div className={'flex justify-center w-full'}>
        <EditAmountLink />
      </div>
      <div style={style(sm_mb)} className={'flex justify-center w-full'}>
        <EditCardLink />
      </div>
      <div style={style()} className={'flex justify-center w-full'}>
        <StreetField />
      </div>
      <div style={style()} className={'flex justify-center w-full'}>
        <CityField />
        <ZipCodeField />
      </div>
      <div style={style(sm_mb)} className={'flex justify-center w-full'}>
        <CountryField />
      </div>
      {props.options.offerNewsLetter && (
        <div style={style(sm_mb)} className={'flex justify-center w-full'}>
          <StayInTouchField />
        </div>
      )}
      <div className={'flex justify-center w-full'}>
        <DonateButton isSendingForm={donationState.isSendingForm} />
      </div>
    </div>
  );
});
