import React, { PureComponent } from "react";
import dateFns from "date-fns";
import DayTitle from "./DayTitle";
import Day from "./Day";
import { WeeksProps } from "./types";

export default class Weeks extends PureComponent<WeeksProps> {
  generateClasses(day: Date) {
    let classSet = "";
    classSet += ` ${dateFns.format(day, "ddd")}`;
    classSet += dateFns.isToday(day) ? " today" : "";
    classSet += this.isDaySelected(day) ? " selected" : "";
    classSet += this.isdayDisabled(day) ? " disabled" : "";

    return classSet;
  }

  isDaySelected(day: Date) {
    const { selectedDate, startTime, endTime } = this.props;
    if(dateFns.isSameDay(day, selectedDate) || dateFns.isWithinRange(day, startTime, endTime)) {
      return true;
    } 
  }

  isdayDisabled(day: Date) {
    const { clickable, disableHistory, selectedDate, timeslot } = this.props;
    if (!clickable || (disableHistory && dateFns.isBefore(day, dateFns.endOfYesterday())) || !dateFns.isSameMonth(day, selectedDate)) { 
      return true
    };

    if(!timeslot && this.isBetweenBookings(day)) {
      return true;
    }
  }
  
  isBetweenBookings(day: Date) {
    const { bookings } = this.props;
    for (let f = 0; f < bookings.length; f += 1) {
      if (dateFns.isWithinRange(
        day,
        dateFns.startOfDay(bookings[f].start_time),
        dateFns.endOfDay(bookings[f].end_time)
      )) {
        return true
      }
     }
  }

  render() {
    const { selectedDate, onDateClick } = this.props;
    const endDate = dateFns.endOfWeek(
      dateFns.endOfMonth(dateFns.startOfMonth(selectedDate))
    );
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
            key={JSON.stringify(day)}
            date={dateFns.format(day, "D")}
            onDateClick={() => onDateClick(cloneDay)}
          />
        );
        day = dateFns.addDays(day, 1);
      }
      rows.push(
        <div className="row" key={JSON.stringify(day)}>
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
