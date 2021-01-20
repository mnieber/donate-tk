import React from 'react';

export const useSyncCarouselHeader = (sliderRef: any, sliderIndex: number) => {
  React.useEffect(() => {
    if (sliderRef.current !== null && sliderIndex >= 0) {
      sliderRef.current.slickGoTo(sliderIndex);
    }
  }, [sliderRef, sliderIndex]);
};
