import React, { PureComponent } from "react";
import dateFns from "date-fns";
import TimeSlot from "./TimeSlot";
import { TimeSelectProps } from "./types";

type TimeSelectState = {
  selectorClass: string;
};
export default class TimeSelect extends PureComponent<
  TimeSelectProps,
  TimeSelectState
> {
  constructor(props) {
    super(props);
    this.state = { selectorClass: "inactive" };
    this.selectorClick = this.selectorClick.bind(this);
    this.generateOpenHours = this.generateOpenHours.bind(this);
  }

  selectorClick(): void {
    const { selectorClass } = this.state;
    this.setState({
      selectorClass: selectorClass === "inactive" ? "active" : "inactive",
    });
  }

  generateOpenHours() {
    const openTimes = [];
    const { openHours, selectedDate } = this.props;
    const dayStart = dateFns.startOfDay(selectedDate);
    const dayNum = parseInt(dateFns.format(selectedDate, "d"), 10);
    if (openHours.length === 1) {
      openTimes[0] = dateFns.addHours(dayStart, openHours[0][0]);
      openTimes[1] = dateFns.addHours(dayStart, openHours[0][1]);
    } else if (openHours.length === 2) {
      if (dayNum === 0 || dayNum === 6) {
        openTimes[0] = dateFns.addHours(dayStart, openHours[1][0]);
        openTimes[1] = dateFns.addHours(dayStart, openHours[1][1]);
      } else {
        openTimes[0] = dateFns.addHours(dayStart, openHours[0][0]);
        openTimes[1] = dateFns.addHours(dayStart, openHours[0][1]);
      }
    } else if (openHours.length === 7) {
      openTimes[0] = dateFns.addHours(dayStart, openHours[dayNum][0]);
      openTimes[1] = dateFns.addHours(dayStart, openHours[dayNum][1]);
    }
    return openTimes;
  }

  render() {
    const {
      timeSlot,
      startTime,
      endTime,
      bookings,
      disableHistory,
      onTimeClick,
    } = this.props;
    const { selectorClass } = this.state;
    const openHours = this.generateOpenHours();
    const dateFormat = "HH-mm";
    const rows = [];
    let timeSlots = [];
    let timePick = openHours[0];
    // eslint-disable-next-line no-mixed-operators
    const difference =
      (dateFns.differenceInMinutes(openHours[1], openHours[0]) / timeSlot) % 4;
    while (timePick < dateFns.addMinutes(openHours[1], timeSlot * difference)) {
      for (let i = 0; i < 4; i += 1) {
        let classSet;
        classSet += dateFns.isBefore(timePick, openHours[1]) ? "" : " disabled";
        classSet += dateFns.isWithinRange(timePick, startTime, endTime)
          ? " selectedTime"
          : "";
        if (disableHistory)
          classSet += dateFns.isBefore(timePick, new Date()) ? " disabled" : "";
        for (let f = 0; f < bookings.length; f += 1) {
          classSet += dateFns.isWithinRange(
            timePick,
            bookings[f].start_time,
            dateFns.subMinutes(bookings[f].end_time, 1)
          )
            ? " disabled"
            : "";
        }
        const cloneTime = timePick;
        timeSlots.push(
          <TimeSlot
            key={cloneTime}
            time={dateFns.format(cloneTime, dateFormat)}
            classSet={classSet}
            onTimeClick={() => onTimeClick(cloneTime)}
          />
        );
        timePick = dateFns.addMinutes(timePick, 30);
      }
      rows.push(
        <div className="row" key={timePick}>
          {timeSlots}
        </div>
      );
      timeSlots = [];
    }

    return (
      <div className="timeSelector">
        <div className="optionSpacer body">
          <div className={`optionHolder ${selectorClass}`}>{rows}</div>
        </div>
      </div>
    );
  }
}
