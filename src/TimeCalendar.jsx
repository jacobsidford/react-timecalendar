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
      currentMonth: new Date(),
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
      currentMonth: dateFns.addMonths(this.state.currentMonth, 1)
    });
  };

  prevMonth() {
    if (this.props.disableHistory) {
      if (dateFns.isPast(this.state.currentMonth)){
        return
      }
    }
    this.setState({
      currentMonth: dateFns.subMonths(this.state.currentMonth, 1)
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
          currentMonth={dateFns.format(this.state.currentMonth, "MMMM YYYY")}
          nextMonth={this.nextMonth}
          prevMonth={this.prevMonth}
          />
        {this.state.timeSelect ?
          <React.Fragment>
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
          </React.Fragment>
          :
          <React.Fragment>
            <Weeks
              currentMonth={this.state.currentMonth}
              selectedDate={this.state.selectedDate}
              disableHistory={this.props.disableHistory}
              onDateClick={this.onDateClick}
              clickable={this.props.clickable}
              bookings={this.props.bookings}
              startTime={this.props.startTime}
              endTime={this.props.endTime}
              />
          </React.Fragment>

        }
        {this.props.timeSlot && this.props.openHours?
          <React.Fragment>
            <div className={'timeSelector'}>
              <p onClick={this.timeSelectToggle}>Selector</p>
            </div>
          </React.Fragment>
        :''}
      </div>
    );
  }
}

TimeCalendar.propTypes = propTypes;
TimeCalendar.defaultProps = defaultProps;
