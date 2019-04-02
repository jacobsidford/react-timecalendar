import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  selectedDate: PropTypes.string,
  prevMonth: PropTypes.func,
  nextMonth: PropTypes.func,
};

const defaultProps = {
  selectedDate: new Date(),
  prevMonth: null,
  nextMonth: null,
};

function Header(props) {
  return(
    <div className="header row flex-middle">

      <div className="col col-start">

        <div className="icon" onClick={props.prevMonth}>
          chevron_left
        </div>

      </div>

      <div className="col col-center">

        <span>
          {props.selectedDate}
        </span>

      </div>

      <div
        className="col col-end"
        onClick={props.nextMonth}>

        <div className="icon">chevron_right</div>

      </div>

    </div>
  );
}
Header.propTypes = propTypes;
Header.defaultProps = defaultProps;

export default Header;
