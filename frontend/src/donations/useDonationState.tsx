import React from 'react';
import { DonationState } from 'src/donations/DonationState';

const DonationStateContext = React.createContext<DonationState | undefined>(
  undefined
);

export const DonationStateProvider: React.FC = ({ children }) => {
  const [donationState] = React.useState<DonationState>(
    () => new DonationState()
  );

  return (
    <DonationStateContext.Provider value={donationState}>
      {children}
    </DonationStateContext.Provider>
  );
};

export const useDonationState = () => {
  const donationState = React.useContext(DonationStateContext);
  if (!donationState) {
    throw new Error(
      'useDonationState must be used within a DonationStateProvider.'
    );
  }

  return donationState;
};
