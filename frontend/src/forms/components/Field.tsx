import React from 'react';
import { FormFieldContext } from 'src/forms/components/FormFieldContext';
import { FormFieldError } from 'src/forms/components/FormFieldError';

type PropsT = React.PropsWithChildren<{
  fieldName: string;
  className?: string;
  label?: string;
}>;

export const Field: React.FC<PropsT> = (props: PropsT) => {
  return (
    <FormFieldContext fieldName={props.fieldName} label={props.label}>
      <div
        className={
          'Field flex flex-col ' + (props.className ? props.className : '')
        }
      >
        {props.children}
        <FormFieldError />
      </div>
    </FormFieldContext>
  );
};
