import type { RecurrenceT } from 'src/donations/types';
import { useFormStateContext } from 'react-form-state-context';
import classnames from 'classnames';

import './Recurrences.scss';

const titleCase = (x: string) =>
  x.charAt(0).toUpperCase() + x.substr(1).toLowerCase();

type RecurrencesPropsT = {
  recurrenceOptions: RecurrenceT[];
  style: any;
};

export function Recurrences(props: RecurrencesPropsT) {
  const formState = useFormStateContext();

  const nodes: Array<any> = props.recurrenceOptions.map((recurrence, idx) => {
    return (
      <button
        key={recurrence}
        onClick={(e) => {
          e.preventDefault();
          formState.setValue('recurrence', recurrence);
        }}
        className={classnames('RecurrenceOption', {
          'RecurrenceOption--selected':
            formState.values.recurrence === recurrence,
          'RecurrenceOption--leftMost': idx === 0,
          'RecurrenceOption--rightMost':
            idx === props.recurrenceOptions.length - 1,
        })}
      >
        {titleCase(recurrence)}
      </button>
    );
  });

  return (
    <div style={props.style} className={`Recurrences flex`}>
      {nodes}
    </div>
  );
}
