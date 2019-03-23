import React, { PureComponent } from "react";
import PropTypes from 'prop-types';
import dateFns from "date-fns";
import Day from './Day';

const propTypes = {
  currentMonth: PropTypes.instanceOf(Date),
  selectedDate: PropTypes.instanceOf(Date),
  onDateClick: PropTypes.func,
  clickable: PropTypes.bool,
  bookings: PropTypes.arrayOf(PropTypes.string)
};

const defaultProps = {
  currentMonth: null,
  selectedDate: null,
  onDateClick: null,
  clickable: true,
  bookings: ['07-03-19', '02-04-19'],
};

export default class Weeks extends PureComponent {
  render() {
    const {currentMonth, selectedDate} = this.props;
    const monthStart = dateFns.startOfMonth(currentMonth);
    const startDate = dateFns.startOfWeek(monthStart);
    const endDate = dateFns.endOfWeek(dateFns.endOfMonth(monthStart));

    const dateFormat = "D";
    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {

        let classSet = '';
        classSet += ' ' + dateFns.format(day, 'ddd');
        classSet += dateFns.isToday(day) ? ' today' : ''
        classSet += dateFns.isSameMonth(day, currentMonth) ? '' : ' disabled'
        classSet += dateFns.isSameDay(day, selectedDate) ? ' selected' : ''
        classSet += this.props.clickable ? '' : ' disabled'
        classSet += dateFns.isWithinRange(day, this.props.startTime, this.props.endTime) ? ' selected' : '';

        const cloneDay = day;
        days.push(
          <Day
            classSet={classSet}
            key={day}
            date={dateFns.format(day, dateFormat)}
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

  Weeks.propTypes = propTypes;
  Weeks.defaultProps = defaultProps;
