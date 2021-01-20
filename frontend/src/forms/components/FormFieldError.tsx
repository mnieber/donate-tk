import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import React from 'react';

import { useFormStateContext } from 'react-form-state-context';
import { useFormFieldContext } from 'src/forms/components/FormFieldContext';
import { tiny_mt, style } from 'src/donations/utils/style';

interface IProps {
  extraClass?: string;
  extraClassOnError?: string;
}

// Generic component that shows the error in fieldName for the current
// form state.
export const FormFieldError: React.FC<IProps> = observer(
  ({ extraClass, extraClassOnError }) => {
    const formState = useFormStateContext();
    const fieldContext = useFormFieldContext();

    const error = formState.getError(fieldContext.fieldName);

    return (
      <div
        style={style(tiny_mt)}
        className={classNames(
          'text-sm text-red-400',
          extraClass,
          extraClassOnError
            ? {
                extraClassOnError: !!error,
              }
            : {}
        )}
      >
        {error}
      </div>
    );
  }
);
