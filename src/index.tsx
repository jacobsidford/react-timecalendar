import React, { PureComponent } from "react";
import {
  addDays,
  addMonths,
  format,
  isPast,
  startOfDay,
  startOfMonth,
  subDays,
  subMonths,
} from "date-fns";
import Header from "./Header";
import Weeks from "./Weeks";
import TimeSelect from "./TimeSelect";
import { TimeCalendarProps } from "./types";
import "./App.scss";

export type {
  TimeCalendarProps,
  Booking,
  SelectedTime,
  DateInput,
} from "./types";

type TimeCalendarState = {
  selectedDate: Date;
  timeSelect: boolean;
};

const noop = () => {};

export class TimeCalendar extends PureComponent<
  TimeCalendarProps,
  TimeCalendarState
> {
  static defaultProps: Partial<TimeCalendarProps> = {
    openHours: [],
    bookings: [],
    disableHistory: true,
    clickable: true,
    timeSlot: 30,
    startTime: "",
    endTime: "",
  };

  constructor(props: TimeCalendarProps) {
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

  onDateClick(day: Date) {
    const { onDateClick, onDateFunction } = this.props;
    this.setState({ selectedDate: day });
    (onDateClick || onDateFunction || noop)(day);
  }

  nextTime() {
    const { selectedDate, timeSelect } = this.state;
    this.setState({
      selectedDate: timeSelect
        ? addDays(selectedDate, 1)
        : addMonths(selectedDate, 1),
    });
  }

  prevTime() {
    const { selectedDate, timeSelect } = this.state;
    const { disableHistory } = this.props;

    if (
      disableHistory &&
      ((!timeSelect && isPast(startOfMonth(selectedDate))) ||
        (timeSelect && isPast(startOfDay(selectedDate))))
    ) {
      return;
    }

    this.setState({
      selectedDate: timeSelect
        ? subDays(selectedDate, 1)
        : subMonths(selectedDate, 1),
    });
  }

  timeSelectToggle() {
    this.setState((state) => ({ timeSelect: !state.timeSelect }));
  }

  render() {
    const {
      disableHistory = true,
      timeSlot = 30,
      openHours = [],
      onTimeClick = noop,
      bookings = [],
      startTime = "",
      endTime = "",
      clickable = true,
    } = this.props;
    const { selectedDate, timeSelect } = this.state;
    const selectedTime = { start: startTime, end: endTime };
    const timeSelectAvailable = timeSlot > 0 && openHours.length > 0;

    return (
      <div className="calendar">
        <Header
          selectedDate={
            timeSelect
              ? format(selectedDate, "EEEE do MMMM")
              : format(selectedDate, "MMMM yyyy")
          }
          nextTime={this.nextTime}
          prevTime={this.prevTime}
        />
        {timeSelect ? (
          <TimeSelect
            selectedDate={selectedDate}
            disableHistory={disableHistory}
            timeSlot={timeSlot}
            openHours={openHours}
            onTimeClick={onTimeClick}
            bookings={bookings}
            selectedTime={selectedTime}
          />
        ) : (
          <Weeks
            selectedDate={selectedDate}
            disableHistory={disableHistory}
            onDateClick={this.onDateClick}
            bookings={bookings}
            timeSlot={timeSelectAvailable ? timeSlot : 0}
            clickable={clickable}
            selectedTime={selectedTime}
          />
        )}
        {timeSelectAvailable && (
          <button
            className="timeSelector"
            onClick={this.timeSelectToggle}
            type="button"
          >
            <p>{timeSelect ? "Select Day" : "Select Time"}</p>
          </button>
        )}
      </div>
    );
  }
}

export default TimeCalendar;
