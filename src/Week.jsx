import React from "react";
import PropTypes from 'prop-types';
import dateFns from "date-fns";
import Day from './Day';


export default class Weeks extends React.Component {

  render() {
    const { currentMonth, selectedDate } = this.props;
    const monthStart = dateFns.startOfMonth(currentMonth);
    const monthEnd = dateFns.endOfMonth(monthStart);
    const startDate = dateFns.startOfWeek(monthStart);
    const endDate = dateFns.endOfWeek(monthEnd);

    const dateFormat = "D";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {

        let className = '';
        if (dateFns.isToday(day)) {
          className += ' today';
        }
        if (dateFns.isSameMonth(day)) {
          className += ' disabled';
        }
        if (dateFns.isSameDay(day, selectedDate)) {
          className += ' selected';
        }
        if (!this.props.clickable) {
          className += ' not-clickable';
        }

        formattedDate = dateFns.format(day, dateFormat);
        const cloneDay = day;
        days.push(
          <Day
          className={className}
          key={day}
          date={formattedDate}
          onDateClick={() => this.props.onDateClick(cloneDay)}
          >
          </Day>
        );
        day = dateFns.addDays(day, 1);
      }
      rows.push(
        <div className="row" key={day}>
        {days}
        </div>
      );
      days = [];
    }
    return <div className="body">{rows}</div>;
  }
}

Weeks.propTypes = {
  currentMonth: PropTypes.instanceOf(dateFns),
  selectedDate: PropTypes.instanceOf(dateFns),
  onDateClick: PropTypes.func,
  clickable: PropTypes.bool,
};

Weeks.defaultProps = {
  currentMonth: null,
  selectedDate: null,
  onDateClick: null,
  clickable: true,
};
