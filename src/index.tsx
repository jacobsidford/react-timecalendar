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
import { CalendarView, TimeCalendarProps } from "./types";
import "./App.scss";

export type {
  TimeCalendarProps,
  CalendarView,
  Booking,
  SelectedTime,
  DateInput,
} from "./types";

type TimeCalendarState = {
  selectedDate: Date;
  view: CalendarView;
};

const noop = () => {};

/**
 * Both `selectedDate` and `view` follow the standard controlled/uncontrolled
 * pattern: pass the prop to control it, pass the `default*` prop (or nothing)
 * to let the component own it. Change callbacks fire in both modes.
 */
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
      selectedDate: props.defaultSelectedDate ?? new Date(),
      view: props.defaultView ?? "month",
    };
    this.onDateClick = this.onDateClick.bind(this);
    this.nextTime = this.nextTime.bind(this);
    this.prevTime = this.prevTime.bind(this);
    this.timeSelectToggle = this.timeSelectToggle.bind(this);
  }

  /**
   * Mirror controlled props into state so that dropping a prop later
   * (controlled → uncontrolled) keeps the last value instead of snapping
   * back to the constructor default.
   */
  static getDerivedStateFromProps(
    props: TimeCalendarProps,
    state: TimeCalendarState
  ): Partial<TimeCalendarState> | null {
    const next: Partial<TimeCalendarState> = {};
    if (props.selectedDate !== undefined && props.selectedDate !== state.selectedDate) {
      next.selectedDate = props.selectedDate;
    }
    if (props.view !== undefined && props.view !== state.view) {
      next.view = props.view;
    }
    return Object.keys(next).length ? next : null;
  }

  get selectedDate(): Date {
    return this.props.selectedDate ?? this.state.selectedDate;
  }

  get timeSelectAvailable(): boolean {
    const { timeSlot = 30, openHours = [] } = this.props;
    return timeSlot > 0 && openHours.length > 0;
  }

  /** The view actually rendered: "day" needs openHours, otherwise month. */
  get view(): CalendarView {
    const requested = this.props.view ?? this.state.view;
    return requested === "day" && this.timeSelectAvailable ? "day" : "month";
  }

  setSelectedDate(day: Date) {
    const { selectedDate, onSelectedDateChange } = this.props;
    if (selectedDate === undefined) this.setState({ selectedDate: day });
    (onSelectedDateChange || noop)(day);
  }

  setView(view: CalendarView) {
    const { view: controlled, onViewChange } = this.props;
    if (controlled === undefined) this.setState({ view });
    (onViewChange || noop)(view);
  }

  onDateClick(day: Date) {
    const { onDateClick, onDateFunction } = this.props;
    this.setSelectedDate(day);
    (onDateClick || onDateFunction || noop)(day);
  }

  nextTime() {
    const { selectedDate, view } = this;
    this.setSelectedDate(
      view === "day" ? addDays(selectedDate, 1) : addMonths(selectedDate, 1)
    );
  }

  prevTime() {
    const { selectedDate, view } = this;
    const { disableHistory } = this.props;

    if (
      disableHistory &&
      ((view === "month" && isPast(startOfMonth(selectedDate))) ||
        (view === "day" && isPast(startOfDay(selectedDate))))
    ) {
      return;
    }

    this.setSelectedDate(
      view === "day" ? subDays(selectedDate, 1) : subMonths(selectedDate, 1)
    );
  }

  timeSelectToggle() {
    this.setView(this.view === "day" ? "month" : "day");
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
    const { selectedDate, timeSelectAvailable } = this;
    const selectedTime = { start: startTime, end: endTime };
    const dayView = this.view === "day";

    return (
      <div className="calendar">
        <Header
          selectedDate={
            dayView
              ? format(selectedDate, "EEEE do MMMM")
              : format(selectedDate, "MMMM yyyy")
          }
          nextTime={this.nextTime}
          prevTime={this.prevTime}
        />
        {dayView ? (
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
            <p>{dayView ? "Select Day" : "Select Time"}</p>
          </button>
        )}
      </div>
    );
  }
}

export default TimeCalendar;
