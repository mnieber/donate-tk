export type RecurrenceT = 'Once' | 'Monthly';

export type CarouselHeaderT = 'Amount' | 'CreditCard' | 'Address' | 'Finish';

export type CurrencyT = {
  code: 'usd' | 'eur';
  symbol: '$' | '€';
};

export type DesignationT = {
  code: string;
  name: string;
};

export type CountryT = {
  code: number;
  name: string;
};

export type FormFieldMapT = any;
export type FormFieldT = string;

export type OptionsT = {
  designationOptions: DesignationT[];
  recurrenceOptions: RecurrenceT[];
  minDonationAmountByCurrency: { [currency: string]: number };
  thankYouMessage: string;
  offerNewsLetter: boolean;
};
