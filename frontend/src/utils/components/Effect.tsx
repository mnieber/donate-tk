import React from 'react';
import { observer } from 'mobx-react-lite';
import useDeepCompareEffect from 'use-deep-compare-effect';

type EffectWithoutArgsPropsT = {
  f: () => void;
};

export const EffectWithoutArgs: (
  props: EffectWithoutArgsPropsT
) => React.ReactElement = observer(({ f }) => {
  useDeepCompareEffect(() => {
    const cleanUpFunction = f();
    return cleanUpFunction;
  }, [f]);
  return <React.Fragment />;
});
