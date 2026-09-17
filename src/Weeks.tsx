import React, { PureComponent } from "react";
import dateFns from "date-fns";
import DayTitle from "./DayTitle";
import Day from "./Day";
import { WeeksProps } from "./types";
import { isWithinSelection } from "./selection";

export default class Weeks extends PureComponent<WeeksProps> {
  generateClasses(day: Date) {
    let classSet = "";
    classSet += ` ${dateFns.format(day, "ddd")}`;
    classSet += dateFns.isToday(day) ? " today" : "";
    classSet += this.isDaySelected(day) ? " selected" : "";
    classSet += this.isDayDisabled(day) ? " disabled" : "";

    return classSet;
  }

  isDaySelected(day: Date): boolean {
    const { selectedDate, selectedTime } = this.props;
    return (
      dateFns.isSameDay(day, selectedDate) ||
      isWithinSelection(day, selectedTime)
    );
  }

  isDayDisabled(day: Date): boolean {
    const { clickable, disableHistory, selectedDate, timeSlot } = this.props;
    if (
      !clickable ||
      (disableHistory && dateFns.isBefore(day, dateFns.endOfYesterday())) ||
      !dateFns.isSameMonth(day, selectedDate)
    ) {
      return true;
    }
    return !timeSlot && this.isBetweenBookings(day);
  }

  isBetweenBookings(day: Date): boolean {
    const { bookings } = this.props;
    return bookings.some((booking) =>
      dateFns.isWithinRange(
        day,
        dateFns.startOfDay(booking.start_time),
        dateFns.endOfDay(booking.end_time)
      )
    );
  }

  render() {
    const { selectedDate, onDateClick } = this.props;
    const endDate = dateFns.endOfWeek(dateFns.endOfMonth(selectedDate));
    const rows = [];
    let days = [];
    let day = dateFns.startOfWeek(dateFns.startOfMonth(selectedDate));

    while (day <= endDate) {
      for (let i = 0; i < 7; i += 1) {
        const classSet = this.generateClasses(day);
        const cloneDay = day;
        days.push(
          <Day
            classSet={classSet}
            key={day.toISOString()}
            date={dateFns.format(day, "D")}
            onDateClick={() => onDateClick(cloneDay)}
          />
        );
        day = dateFns.addDays(day, 1);
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
