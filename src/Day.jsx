import React from "react";
import PropTypes from 'prop-types';

const Day = props => (
  <div className={`col cell${props.className}`} onClick={props.onDateClick}>
  <span className="number">{props.date}</span>
  <span className="bg">{props.date}</span>
  </div>
);

Day.propTypes = {
  className: PropTypes.string,
  onDateClick: PropTypes.func,
  date: PropTypes.string,
};

Day.defaultProps = {
  className: '',
  date: 1,
  onDateClick: null,
};

export default Day;
