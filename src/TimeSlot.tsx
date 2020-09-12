import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  classSet: PropTypes.string,
  time: PropTypes.string,
  onTimeClick: PropTypes.func,
};

const defaultProps = {
  classSet: '',
  time: '12 - 30',
  onTimeClick: null,
};

function TimeSlot(props) {
  const { classSet, onTimeClick, time } = props;
  return (
    <div
      className={`col cell ${classSet}`}
      onClick={onTimeClick}
      onKeyDown={onTimeClick}
      role="button"
      tabIndex={0}
    >
      <p>
        {time}
      </p>
    </div>
  );
}

TimeSlot.propTypes = propTypes;
TimeSlot.defaultProps = defaultProps;

export default TimeSlot;
