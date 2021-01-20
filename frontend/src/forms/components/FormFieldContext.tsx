import React from 'react';

interface FormFieldContextT {
  fieldName: string;
  label: string | undefined;
}

const getNullFormFieldContext = (): FormFieldContextT => {
  return {
    fieldName: '',
    label: undefined,
  };
};

const Context = React.createContext(getNullFormFieldContext());

export const FormFieldContext: React.FC<FormFieldContextT> = ({
  fieldName,
  label,
  children,
}) => {
  return (
    <Context.Provider value={{ fieldName, label }}>{children}</Context.Provider>
  );
};

export const useFormFieldContext = (): FormFieldContextT => {
  return React.useContext(Context);
};
