import React from "react";
import PropTypes from 'prop-types';

const TimeSlot = props => (
  <div className={`col cell${props.className}`} onClick={props.onTimeClick}>
  <p>{props.time}</p>
  </div>
);


export default TimeSlot;
