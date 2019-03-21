import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  classSet: PropTypes.string,
  date: PropTypes.string,
  onDateClick: PropTypes.func,
};

const defaultProps = {
  classSet: "",
  date: 1,
  onDateClick: null,
};

function Day(props) {
  return(
    <div
      className={'col cell' + props.classSet}
      onClick={props.onDateClick}>

      <span className="number">
        {props.date}
      </span>

      <span className="bg">
        {props.date}
      </span>

    </div>
  );
}

Day.propTypes = propTypes;
Day.defaultProps = defaultProps;

export default Day;
