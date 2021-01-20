import React from 'react';
import { observer } from 'mobx-react-lite';
import Slider from 'react-slick';
import { AmountsView } from 'src/donations/components/AmountsView';
import { AddressView } from 'src/donations/components/AddressView';
import { FinishView } from 'src/donations/components/FinishView';
import { CreditCardView } from 'src/donations/components/CreditCardView';
import { useSyncCarouselHeader } from 'src/donations/components/useSyncCarouselHeader';
import { CarouselHeaderT, OptionsT } from 'src/donations/types';
import { useDonationState } from 'src/donations/useDonationState';
import './Carousel.scss';

const carouselHeaders: CarouselHeaderT[] = [
  'Amount',
  'CreditCard',
  'Address',
  'Finish',
];

const View = ({ children }: any) => {
  return (
    <div className={'CarouselView flex flex-col items-center'}>{children}</div>
  );
};

type PropsT = {
  options: OptionsT;
};

export const Carousel: React.FC<PropsT> = observer((props: PropsT) => {
  const slider = React.useRef(null);
  const donationState = useDonationState();
  console.assert(carouselHeaders.includes(donationState.carouselHeader));

  useSyncCarouselHeader(
    slider,
    carouselHeaders.indexOf(donationState.carouselHeader)
  );

  return (
    <div className={'Carousel mx-auto max-w-lg'}>
      <Slider
        arrows={false}
        dots={false}
        infinite={false}
        speed={500}
        draggable={false}
        slidesToShow={1}
        slidesToScroll={1}
        ref={slider}
      >
        <View>
          <AmountsView options={props.options} />
        </View>
        <View>
          <CreditCardView options={props.options} />
        </View>
        <View>
          <AddressView options={props.options} />
        </View>
        <View>
          <FinishView options={props.options} />
        </View>
      </Slider>
    </div>
  );
});
