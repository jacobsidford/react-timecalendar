import React from "react";
import PropTypes from 'prop-types';
import dateFns from "date-fns";

export default class DayTitles extends React.Component {
  render() {
    const dateFormat = "dddd";
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

DayTitles.propTypes = {
  currentMonth: PropTypes.instanceOf(dateFns),
};

DayTitles.defaultProps = {
  currentMonth: null,
};
