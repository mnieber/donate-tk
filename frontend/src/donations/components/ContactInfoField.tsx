import { useFormFieldContext } from 'src/forms/components/FormFieldContext';
import {
  useFormStateContext,
  createFormFieldProps,
} from 'react-form-state-context';

type ContactInfoFieldT = {
  isAutoComplete: boolean;
  placeholder: string;
  className: string;
  maxLength?: any;
  onFocus?: Function;
  id?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const ContactInfoField = (props: ContactInfoFieldT) => {
  const formState = useFormStateContext();
  const formField = useFormFieldContext();

  return (
    <input
      {...createFormFieldProps({
        formState,
        fieldName: formField.fieldName,
        fieldType: 'text',
      })}
      {...(props.id ? { id: props.id } : {})}
      {...(props.maxLength ? { maxLength: props.maxLength } : {})}
      {...(props.onChange ? { onChange: props.onChange } : {})}
      {...(props.onFocus
        ? {
            onFocus: (e: any) => {
              e.preventDefault();
              props.onFocus && props.onFocus();
            },
          }
        : {})}
      autoComplete={props.isAutoComplete ? 'on' : 'off'}
      className={props.className}
      placeholder={props.placeholder}
    />
  );
};
