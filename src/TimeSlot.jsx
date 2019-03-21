import React from "react";
import PropTypes from 'prop-types';

const propTypes = {
  classSet: PropTypes.string,
  time: PropTypes.string,
  onTimeClick: PropTypes.func,
};

const defaultProps = {
  classSet: '',
  time: 12-30,
  onTimeClick: null,
};

function TimeSlot(props) {
  return(
    <div
      className={'col cell' + props.classSet}
      onClick={props.onTimeClick}>
      <p>
        {props.time}
      </p>
    </div>
  );
}

TimeSlot.propTypes = propTypes;
TimeSlot.defaultProps = defaultProps;

export default TimeSlot;
