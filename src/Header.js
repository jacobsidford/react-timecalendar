import React from "react";
import PropTypes from 'prop-types';

const Header = props => (
  <div className="header row flex-middle">
  <div className="col col-start">
  <div className="icon" onClick={props.prevMonth}>
  chevron_left
  </div>
  </div>
  <div className="col col-center">
  <span>{props.currentMonth}</span>
  </div>
  <div className="col col-end" onClick={props.nextMonth}>
  <div className="icon">chevron_right</div>
  </div>
  </div>
);

Header.propTypes = {
  currentMonth: PropTypes.string,
  prevMonth: PropTypes.func,
  nextMonth: PropTypes.func,
};

Header.defaultProps = {
  currentMonth: new Date(),
  prevMonth: null,
  nextMonth: null,
};
export default Header;
