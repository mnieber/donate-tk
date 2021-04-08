import { createBrowserHistory } from 'history';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import { DonationFormView } from 'src/donations/components/DonationFormView';
import { OptionsT } from 'src/donations/types';
import { DonationStateProvider } from 'src/donations/useDonationState';
import { CancelDonationView } from 'src/donations/components/CancelDonationView';

type PropsT = {};

export const history = createBrowserHistory();

const options: OptionsT = {
  designationOptions: [
    { code: 'none', name: 'Use my donations for animals however you see fit' },
    { code: 'bc', name: 'Use for Beyond Carnism' },
    { code: 'ceva', name: 'Use for Center for Effective Vegan Advocacy' },
    { code: 'proveg', name: 'Use for ProVeg International' },
  ],
  recurrenceOptions: ['once', 'monthly'],
  minDonationAmountByCurrency: { usd: 5, eur: 5 },
  thankYouMessage: "We're doing our best to help the animals.",
  offerNewsLetter: false,
};

export const UrlRouter: React.FC<PropsT> = observer((props: PropsT) => {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/donate/page">
          <DonationStateProvider>
            <DonationFormView options={options} />
          </DonationStateProvider>
        </Route>
        <Route path="/donate/cancel/:customer_id/:subscription_id">
          <CancelDonationView />
        </Route>
      </Switch>
    </Router>
  );
});
