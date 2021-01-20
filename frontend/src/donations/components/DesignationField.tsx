import React from 'react';
import classnames from 'classnames';
import { map } from 'lodash/fp';
import { useFormStateContext } from 'react-form-state-context';
import { Field } from 'src/forms/components/Field';
import { DesignationT, OptionsT } from 'src/donations/types';

import './DesignationField.scss';

type PropsT = {
  options: OptionsT;
};

export const DesignationField: React.FC<PropsT> = (props: PropsT) => {
  function createDesignationOptions() {
    return map((designation: DesignationT) => {
      return (
        <option value={designation.code} key={designation.code}>
          {`${designation.name}`}
        </option>
      );
    })(props.options.designationOptions);
  }

  let designationOptions = createDesignationOptions();
  const formState = useFormStateContext();

  return (
    <div className={classnames('DesignationField', 'flex', 'flex-grow')}>
      <Field fieldName="designation" className="flex-grow">
        <select
          name="designation"
          defaultValue={formState.values['designation']}
          onChange={(event) => {
            formState.setValue('designation', event.target.value);
          }}
        >
          {designationOptions}
        </select>
      </Field>
    </div>
  );
};
