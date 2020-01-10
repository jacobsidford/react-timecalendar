import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  selectedDate: PropTypes.string,
  prevTime: PropTypes.func,
  nextTime: PropTypes.func,
};

const defaultProps = {
  selectedDate: new Date(),
  prevTime: null,
  nextTime: null,
};

function Header(props) {
  const { prevTime, selectedDate, nextTime } = props;
  return (
    <div className="header row flex-middle">
      <div className="col col-start">
        <div
          className="icon"
          onClick={prevTime}
          onKeyDown={prevTime}
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
        onClick={nextTime}
        onKeyDown={nextTime}
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
