import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  FormStateProvider,
  HandleValidateArgsT,
} from 'react-form-state-context';
import { Carousel } from 'src/donations/components/Carousel';
import { handleValidate } from 'src/donations/validation';
import { OptionsT } from 'src/donations/types';

type PropsT = {
  options: OptionsT;
};

export const DonationFormView: React.FC<PropsT> = observer((props: PropsT) => {
  const initialValues = {
    recurrence: 'Monthly',
    amount: 50,
    currency: 'usd',
    email: 'mnieber@gmail.com',
    firstName: 'Maarten',
    lastName: 'Nieber',
    streetAddress: 'Weg 123',
    city: 'Stad',
    zipCode: '12345',
    country: 1016,
    creditCardNumber: '4000 0000 0000 9995',
    creditCardSecurityCode: '123',
    creditCardExpireMonth: 11,
    creditCardExpireYear: 22,
    designation: null,
    stayInTouch: null,
  };

  const initialErrors = {};

  return (
    <div className={'DonationFormView'}>
      <FormStateProvider
        initialValues={initialValues}
        initialErrors={initialErrors}
        handleValidate={(args: HandleValidateArgsT) =>
          handleValidate(props.options.minDonationAmountByCurrency, args)
        }
      >
        <Carousel options={props.options} />
      </FormStateProvider>
    </div>
  );
});
