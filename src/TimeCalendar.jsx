import React from "react";
import PropTypes from 'prop-types';
import dateFns from "date-fns";
import Header from './Header';
import DayTitles from './DayTitles';
import Weeks from './Week';
import TimeSelect from './TimeSelect';
import "./App.css";

export default class TimeCalendar extends React.Component {
  state = {
    currentMonth: new Date(),
    selectedDate: new Date(),
    disableHistory: this.props.disableHistory,
  };

  onDateClick = day => {
    this.setState({
      selectedDate: day
    });
    if (this.props.functionPassed)this.props.functionPassed(day);
  };

  nextMonth = () => {
    this.setState({
      currentMonth: dateFns.addMonths(this.state.currentMonth, 1)
    });
  };

  prevMonth = () => {
    if (this.state.disableHistory) {
      if (dateFns.isPast(this.state.currentMonth)){
        return
      }
    }
    this.setState({
      currentMonth: dateFns.subMonths(this.state.currentMonth, 1)
    });
  };

  render() {
    return (
      <div className="calendar">
      <Header
      nextMonth={this.nextMonth}
      prevMonth={this.prevMonth}
      currentMonth={dateFns.format(this.state.currentMonth, "MMMM YYYY")}
      />
      <DayTitles currentMonth={this.state.currentMonth} />
      <Weeks
      currentMonth={this.state.currentMonth}
      selectedDate={this.state.selectedDate}
      onDateClick={this.onDateClick}
      clickable={this.props.clickable}
      />
      {this.props.timeSlot ? <TimeSelect /> : ""}
      </div>
    );
  }
}

TimeCalendar.propTypes = {
  disableHistory: PropTypes.bool,
  timeSlot: PropTypes.number,
  clickable: PropTypes.bool,
};

TimeCalendar.defaultProps = {
  disableHistory: true,
  timeSlot: 30,
  clickable: true,
};
