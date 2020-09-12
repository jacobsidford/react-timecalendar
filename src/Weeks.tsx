import React, { PureComponent } from "react";
import dateFns from "date-fns";
import DayTitle from "./DayTitle";
import Day from "./Day";
import { WeeksProps } from "./types";

export default class Weeks extends PureComponent<WeeksProps> {
  generateClasses(day) {
    const {
      selectedDate,
      clickable,
      startTime,
      endTime,
      disableHistory,
    } = this.props;
    let classSet = "";
    classSet += ` ${dateFns.format(day, "ddd")}`;
    classSet += dateFns.isToday(day) ? " today" : "";
    classSet += dateFns.isSameMonth(day, selectedDate) ? "" : " disabled";
    classSet += dateFns.isSameDay(day, selectedDate) ? " selected" : "";
    classSet += clickable ? "" : " disabled";
    classSet += dateFns.isWithinRange(day, startTime, endTime)
      ? " selected"
      : "";
    if (disableHistory)
      classSet += dateFns.isBefore(day, dateFns.endOfYesterday())
        ? " disabled"
        : "";

    return classSet;
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
