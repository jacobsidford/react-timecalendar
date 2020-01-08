import React, { PureComponent } from "react";
import PropTypes from 'prop-types';
import dateFns from 'date-fns';
import Header from './Header';
import Weeks from './Weeks';
import TimeSelect from './TimeSelect';
import './App.scss';

const propTypes = {
  openHours: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  booking: PropTypes.arrayOf(PropTypes.string),
  disableHistory: PropTypes.bool,
  clickable: PropTypes.bool,
  timeSlot: PropTypes.number,
  onDateFunction: PropTypes.func,
  onTimeClick: PropTypes.func,
};

const defaultProps = {
  bookings:[],
  disableHistory: true,
  clickable: true,
  timeSlot: 30,
  onDateFunction: null,
  onTimeClick: null
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
    this.setState({
      selectedDate: day
    });
    if (this.props.onDateFunction)this.props.onDateFunction(day);
  };

  nextMonth() {
    this.setState({
      selectedDate: dateFns.addMonths(this.state.selectedDate, 1)
    });
  };

  prevMonth() {
    if (this.props.disableHistory) {
      if (dateFns.isPast(dateFns.startOfMonth(this.state.selectedDate))){
        return
      }
    }
    this.setState({
      selectedDate: dateFns.subMonths(this.state.selectedDate, 1)
    });
  };

  timeSelectToggle() {
    this.setState({
      timeSelect: !this.state.timeSelect
    });
  };

  render() {
    return (
      <div className="calendar">
        <Header
          selectedDate={dateFns.format(this.state.selectedDate, "MMMM YYYY")}
          nextMonth={this.nextMonth}
          prevMonth={this.prevMonth}
          />
        {this.state.timeSelect ?
          <>
            <TimeSelect
              selectedDate={this.state.selectedDate}
              disableHistory={this.props.disableHistory}
              timeSlot={this.props.timeSlot}
              openHours={this.props.openHours}
              onTimeClick={this.props.onTimeClick}
              bookings={this.props.bookings}
              startTime={this.props.startTime}
              endTime={this.props.endTime}
              />
          </>
          :
          <>
            <Weeks
              selectedDate={this.state.selectedDate}
              disableHistory={this.props.disableHistory}
              onDateClick={this.onDateClick}
              clickable={this.props.clickable}
              bookings={this.props.bookings}
              startTime={this.props.startTime}
              endTime={this.props.endTime}
              />
          </>

        }
        {this.props.timeSlot && this.props.openHours?
          <>
            <div className={'timeSelector'}>
              <p onClick={this.timeSelectToggle}>{this.state.timeSelect ? "Select Day" : "Select Time" } </p>
            </div>
          </>
        :''}
      </div>
    );
  }
}

TimeCalendar.propTypes = propTypes;
TimeCalendar.defaultProps = defaultProps;
