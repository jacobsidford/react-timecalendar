import React from "react";
import PropTypes from 'prop-types';
import dateFns from "date-fns";

const propTypes = {
  currentMonth: PropTypes.instanceOf(Date)
};

const defaultProps = {
  currentMonth: null,
};

export default class DayTitles extends React.Component {
  render() {
    const dateFormat = window.innerWidth > 767 ? "dddd" : "ddd";
    const days = [];
    let startDate = dateFns.startOfWeek(this.props.currentMonth);
    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="col col-center" key={i}>
        {dateFns.format(dateFns.addDays(startDate, i), dateFormat)}
        </div>
      );
    }
    return <div className="days row">{days}</div>;
  }
}

DayTitles.propTypes = propTypes;
DayTitles.defaultProps = defaultProps;
