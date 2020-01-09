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
  const { prevMonth, selectedDate, nextMonth } = props;
  return (
    <div className="header row flex-middle">
      <div className="col col-start">
        <div
          className="icon"
          onClick={prevMonth}
          onKeyDown={prevMonth}
          tabIndex="0"
          role="button"
        >
          chevron_left
        </div>
      </div>
      <div className="col col-center">
        <span>
          {selectedDate}
        </span>
      </div>
      <div
        className="col col-end"
        onClick={nextMonth}
        onKeyDown={nextMonth}
        tabIndex="0"
        role="button"
      >
        <div className="icon">chevron_right</div>
      </div>
    </div>
  );
}
Header.propTypes = propTypes;
Header.defaultProps = defaultProps;

export default Header;
