import classnames from 'classnames';
import { map } from 'lodash/fp';
import { useFormStateContext } from 'react-form-state-context';
import Constants from 'src/donations/constants';
import type { CountryT } from 'src/donations/types';
import { Field } from 'src/forms/components/Field';
import './CountryField.scss';

export const CountryField = () => {
  function createCountryOptions() {
    return map((country: CountryT) => {
      return (
        <option value={country.code} key={country.name}>
          {country.name}
        </option>
      );
    })(Constants.countries);
  }

  let countryOptions = createCountryOptions();
  const formState = useFormStateContext();

  return (
    <Field fieldName="country">
      <div className={classnames('CountryField', 'flex')}>
        <select
          name="country"
          defaultValue={formState.values['country']}
          onChange={(event) => {
            formState.setValue(
              'country',
              event.target.value === '0' ? undefined : event.target.value
            );
          }}
        >
          {countryOptions}
        </select>
      </div>
    </Field>
  );
};
