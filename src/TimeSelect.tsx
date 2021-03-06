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
  constructor(props: TimeSelectProps) {
    super(props);
    this.state = { selectorClass: "inactive" };
    this.selectorClick = this.selectorClick.bind(this);
    this.generateOpenHours = this.generateOpenHours.bind(this);
    this.isTimeDisabled = this.isTimeDisabled.bind(this);
  }

  selectorClick(): void {
    const { selectorClass } = this.state;
    this.setState({
      selectorClass: selectorClass === "inactive" ? "active" : "inactive",
    });
  }

  generateOpenHours(): Date[] {
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

  isTimeDisabled(time: Date, openHours: Date[]) {
    const { bookings, disableHistory } = this.props;
    if (disableHistory && dateFns.isBefore(time, new Date()) || !dateFns.isBefore(time, openHours[1])) { 
      return true
    };

    for (let f = 0; f < bookings.length; f += 1) {
      if (dateFns.isWithinRange(
        time,
        bookings[f].start_time,
        dateFns.subMinutes(bookings[f].end_time, 1)
      )) {
        return true
      }
    }
  }

  render() {
    const {
      timeSlot,
      selectedTime,
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
        let classSet = '';
        classSet += dateFns.isBefore(timePick, openHours[1]) ? "" : " disabled";
        classSet += dateFns.isWithinRange(timePick, selectedTime.start, selectedTime.end)
          ? " selectedTime"
          : "";
          classSet += this.isTimeDisabled(timePick, openHours) ? " disabled" : "";

        const cloneTime = timePick;
        timeSlots.push(
          <TimeSlot
            key={String(cloneTime)}
            time={dateFns.format(cloneTime, dateFormat)}
            classSet={classSet}
            onTimeClick={() => onTimeClick(cloneTime)}
          />
        );
        timePick = dateFns.addMinutes(timePick, timeSlot);
      }
      rows.push(
        <div className="row" key={String(timePick)}>
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
