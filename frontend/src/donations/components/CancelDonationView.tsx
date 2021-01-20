import React from 'react';
import { useParams } from 'react-router-dom';
import { useSearchParams } from 'src/donations/utils/useSearchParams';
import { cancelDonation } from 'src/donations/api';
import { sm_mb, style } from 'src/donations/utils/style';
import './CancelDonationView.scss';

type PropsT = {};

export function CancelDonationView(props: PropsT) {
  const [responseCode, setResponseCode] = React.useState<number | undefined>(
    undefined
  );

  const params: any = useParams();
  const { all: searchParams } = useSearchParams();

  const cancelledDiv = (
    <div>
      <h1 style={style(sm_mb)}>Thanks for your support!</h1>
      Your donation was cancelled.
    </div>
  );

  const alreadyCancelledDiv = (
    <div>
      <h1 style={style(sm_mb)}>Already cancelled</h1>
      <div>
        This donation has already been cancelled in the past. If you have any
        questions regarding this donation, please contact us by email.
      </div>
    </div>
  );

  const missingParamsDiv = (
    <div>
      <h1 style={style(sm_mb)}>Oops</h1>
      There seems to be something wrong with the link to cancel your donation.
      Please try again, or contact us by email and we will cancel the donation
      for you.
    </div>
  );

  const serverError = (
    <div>
      <h1 style={style(sm_mb)}>Oops</h1>
      There seems to be a problem on our servers. Please try again later, or
      contact us by email and we will cancel the donation for you.
    </div>
  );

  const isValidLink =
    responseCode !== 400 &&
    params.customer_id &&
    params.subscription_id &&
    searchParams.amount &&
    searchParams.currency &&
    searchParams.interval &&
    searchParams.checksum;

  const onCancelDonation = () => {
    cancelDonation(
      params.customer_id,
      params.subscription_id,
      searchParams.checksum
    )
      .then(() => {
        setResponseCode(200);
      })
      .catch((error: any) => {
        setResponseCode(error.status);
      });
  };

  const cancelDiv = (
    <div>
      <h1 style={style(sm_mb)}>Thanks for your support!</h1>
      <div style={style(sm_mb)}>
        {`You are about to cancel your ${
          searchParams.interval + 'ly'
        } donation of ` +
          `${searchParams.amount} ${searchParams.currency?.toUpperCase()}`}
      </div>
      <button
        className="CancelDonationView__CancelButton"
        onClick={onCancelDonation}
      >
        CANCEL DONATION
      </button>
    </div>
  );

  return (
    <div className="CancelDonationView mx-auto max-w-lg flex flex-col w-full py-2">
      {!isValidLink && missingParamsDiv}
      {isValidLink && responseCode === 200 && cancelledDiv}
      {isValidLink && responseCode === 404 && alreadyCancelledDiv}
      {isValidLink && responseCode === 500 && serverError}
      {isValidLink && responseCode === undefined && cancelDiv}
    </div>
  );
}
