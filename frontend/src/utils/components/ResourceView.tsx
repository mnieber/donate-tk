import React from 'react';
import { observer } from 'mobx-react-lite';

import {
  RST,
  isResetRS,
  isUpdatingRS,
  isUpdatedRS,
  isErroredRS,
} from 'src/utils/RST';

type PropsT<UpdatingT> = {
  rs: RST<UpdatingT>;
  renderUpdated: () => JSX.Element;
  renderUpdating?: (updating_state: UpdatingT) => JSX.Element;
  renderErrored?: (message: string) => JSX.Element;
};

// TODO better default renders
const defaultRenderErrored = (message: string) => {
  return <div>Error{message !== undefined && `: ${message}`}</div>;
};
const defaultRenderUpdating = () => {
  return <div>Loading...</div>;
};

export const ResourceView = observer(
  <UpdatingT,>(props: PropsT<UpdatingT>): JSX.Element => {
    const renderErrored = props.renderErrored ?? defaultRenderErrored;
    const renderUpdating = props.renderUpdating ?? defaultRenderUpdating;

    const tryRenderUpdated = () => {
      try {
        const result = props.renderUpdated();
        return result;
      } catch (e) {
        return renderErrored(e.message);
      }
    };

    const catchAll = () => {
      throw Error(`Received unrecognized resource state ${props.rs}`);
    };

    const renderReset = () => {
      return <React.Fragment />;
    };

    return isUpdatedRS(props.rs)
      ? tryRenderUpdated()
      : isErroredRS(props.rs)
      ? renderErrored(props.rs.message)
      : isUpdatingRS(props.rs)
      ? renderUpdating(props.rs.updating_state)
      : isResetRS(props.rs)
      ? renderReset()
      : catchAll();
  }
);
