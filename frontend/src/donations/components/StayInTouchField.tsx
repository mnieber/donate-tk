import jQuery from 'jquery';
import classnames from 'classnames';
import { useFormStateContext } from 'react-form-state-context';
import { style, xs_ml } from 'src/donations/utils/style';

import './StayInTouchField.scss';

export const StayInTouchField = () => {
  const formState = useFormStateContext();

  return (
    <div className={'flex w-96'}>
      <div className={classnames('StayInTouchField', 'flex')}>
        <input
          id="checkboxStayInTouch"
          type="checkbox"
          className="mt-1"
          checked={formState.values.stayInTouch}
          onChange={(e) => {
            formState.setValue('stayInTouch', !formState.values.stayInTouch);
          }}
        />
        <div
          style={style(xs_ml)}
          onClick={() => {
            jQuery('#checkboxStayInTouch').trigger('click');
          }}
        >
          I wish to receive occasional emails about new campaigns
        </div>
      </div>
    </div>
  );
};
