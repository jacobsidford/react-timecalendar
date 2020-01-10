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
    this.nextTime = this.nextTime.bind(this);
    this.prevTime = this.prevTime.bind(this);
    this.timeSelectToggle = this.timeSelectToggle.bind(this);
  }

  onDateClick(day) {
    const { onDateFunction } = this.props;
    this.setState({
      selectedDate: day,
    });
    if (onDateFunction) onDateFunction(day);
  }

  nextTime() {
    const { selectedDate, timeSelect } = this.state;
    this.setState({
      selectedDate: timeSelect ? dateFns.addDays(selectedDate, 1) : dateFns.addMonths(selectedDate, 1),
    });
  }

  prevTime() {
    const { selectedDate, timeSelect } = this.state;
    const { disableHistory } = this.props;

    if (disableHistory
      && ((dateFns.isPast(dateFns.startOfMonth(selectedDate)) && !timeSelect)
      || (dateFns.isPast(dateFns.startOfDay(selectedDate)) && timeSelect))
    ) return;

    this.setState({
      selectedDate: timeSelect ? dateFns.subDays(selectedDate, 1) : dateFns.subMonths(selectedDate, 1),
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
          selectedDate={!timeSelect ? dateFns.format(selectedDate, 'MMMM YYYY') : dateFns.format(selectedDate, 'dddd Do MMMM')}
          nextTime={this.nextTime}
          prevTime={this.prevTime}
          timeSelect={timeSelect}
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
