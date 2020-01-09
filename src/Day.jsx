import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  classSet: PropTypes.string,
  date: PropTypes.string,
  onDateClick: PropTypes.func,
};

const defaultProps = {
  classSet: '',
  date: 1,
  onDateClick: null,
};

function Day(props) {
  const { classSet, onDateClick, date } = props;
  return (
    <div
      className={`col cell${classSet}`}
      role="gridcell"
      tabIndex="0"
      onClick={onDateClick}
      onKeyDown={onDateClick}
    >
      <span className="number">
        {date}
      </span>
      <span className="bg">
        {date}
      </span>
    </div>
  );
}

Day.propTypes = propTypes;
Day.defaultProps = defaultProps;

export default Day;
