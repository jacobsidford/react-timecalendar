import React, { PureComponent } from "react";
import {
  addDays,
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYesterday,
  format,
  isBefore,
  isSameDay,
  isSameMonth,
  isToday,
  isWithinInterval,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import DayTitle from "./DayTitle";
import Day from "./Day";
import { WeeksProps } from "./types";
import { isWithinSelection } from "./selection";
import { toDateValue } from "./dates";

export default class Weeks extends PureComponent<WeeksProps> {
  generateClasses(day: Date) {
    let classSet = "";
    classSet += ` ${format(day, "EEE")}`;
    classSet += isToday(day) ? " today" : "";
    classSet += this.isDaySelected(day) ? " selected" : "";
    classSet += this.isDayDisabled(day) ? " disabled" : "";

    return classSet;
  }

  isDaySelected(day: Date): boolean {
    const { selectedDate, selectedTime } = this.props;
    return isSameDay(day, selectedDate) || isWithinSelection(day, selectedTime);
  }

  isDayDisabled(day: Date): boolean {
    const { clickable, disableHistory, selectedDate, timeSlot } = this.props;
    if (
      !clickable ||
      (disableHistory && isBefore(day, endOfYesterday())) ||
      !isSameMonth(day, selectedDate)
    ) {
      return true;
    }
    return !timeSlot && this.isBetweenBookings(day);
  }

  isBetweenBookings(day: Date): boolean {
    const { bookings } = this.props;
    return bookings.some((booking) => {
      const start = startOfDay(toDateValue(booking.start_time));
      const end = endOfDay(toDateValue(booking.end_time));
      return start <= end && isWithinInterval(day, { start, end });
    });
  }

  render() {
    const { selectedDate, onDateClick } = this.props;
    const endDate = endOfWeek(endOfMonth(selectedDate));
    const rows = [];
    let days = [];
    let day = startOfWeek(startOfMonth(selectedDate));

    while (day <= endDate) {
      for (let i = 0; i < 7; i += 1) {
        const classSet = this.generateClasses(day);
        const cloneDay = day;
        days.push(
          <Day
            classSet={classSet}
            key={day.toISOString()}
            date={format(day, "d")}
            onDateClick={() => onDateClick(cloneDay)}
          />
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="row" key={day.toISOString()}>
          {days}
        </div>
      );
      days = [];
    }
    return (
      <div className="body">
        <DayTitle currentMonth={selectedDate} />
        {rows}
      </div>
    );
  }
}
