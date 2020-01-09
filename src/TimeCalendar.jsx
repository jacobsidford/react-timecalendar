import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import dateFns from 'date-fns';
import Header from './Header';
import Weeks from './Weeks';
import TimeSelect from './TimeSelect';
import './App.scss';

const propTypes = {
  openHours: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  bookings: PropTypes.arrayOf(PropTypes.string),
  disableHistory: PropTypes.bool,
  clickable: PropTypes.bool,
  timeSlot: PropTypes.number,
  onDateFunction: PropTypes.func,
  onTimeClick: PropTypes.func,
  startTime: PropTypes.string,
  endTime: PropTypes.string,
};

const defaultProps = {
  bookings: [],
  disableHistory: true,
  clickable: true,
  timeSlot: 30,
  onDateFunction: null,
  onTimeClick: null,
  startTime: null,
  endTime: null,
  openHours: [
    [9.5, 15],
    [9, 23.5],
  ],
};

export default class TimeCalendar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: new Date(),
      timeSelect: false,
    };
    this.onDateClick = this.onDateClick.bind(this);
    this.nextMonth = this.nextMonth.bind(this);
    this.prevMonth = this.prevMonth.bind(this);
    this.timeSelectToggle = this.timeSelectToggle.bind(this);
  }

  onDateClick(day) {
    const { onDateFunction } = this.props;
    this.setState({
      selectedDate: day,
    });
    if (onDateFunction) onDateFunction(day);
  }

  nextMonth() {
    const { selectedDate } = this.state;
    this.setState({
      selectedDate: dateFns.addMonths(selectedDate, 1),
    });
  }

  prevMonth() {
    const { disableHistory } = this.props;
    const { selectedDate } = this.state;
    if (disableHistory) {
      if (dateFns.isPast(dateFns.startOfMonth(selectedDate))) {
        return;
      }
    }
    this.setState({
      selectedDate: dateFns.subMonths(selectedDate, 1),
    });
  }

  timeSelectToggle() {
    const { timeSelect } = this.state;
    this.setState({
      timeSelect: !timeSelect,
    });
  }

  render() {
    const {
      disableHistory, timeSlot, openHours, onTimeClick, bookings, startTime, endTime, clickable,
    } = this.props;
    const { selectedDate, timeSelect } = this.state;
    return (
      <div className="calendar">
        <Header
          selectedDate={dateFns.format(selectedDate, 'MMMM YYYY')}
          nextMonth={this.nextMonth}
          prevMonth={this.prevMonth}
        />
        {timeSelect
          ? (
            <>
              <TimeSelect
                selectedDate={selectedDate}
                disableHistory={disableHistory}
                timeSlot={timeSlot}
                openHours={openHours}
                onTimeClick={onTimeClick}
                bookings={bookings}
                startTime={startTime}
                endTime={endTime}
              />
            </>
          )
          : (
            <>
              <Weeks
                selectedDate={selectedDate}
                disableHistory={disableHistory}
                onDateClick={this.onDateClick}
                clickable={clickable}
                startTime={startTime}
                endTime={endTime}
              />
            </>
          )}
        {timeSlot && openHours
         && (
         <button className="timeSelector" onClick={this.timeSelectToggle} type="button">
           <p>
             {timeSelect ? 'Select Day' : 'Select Time' }
           </p>
         </button>
         )}
      </div>
    );
  }
}

TimeCalendar.propTypes = propTypes;
TimeCalendar.defaultProps = defaultProps;
