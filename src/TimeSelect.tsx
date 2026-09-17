import React, { PureComponent } from "react";
import dateFns from "date-fns";
import TimeSlot from "./TimeSlot";
import { TimeSelectProps } from "./types";
import { isWithinSelection } from "./selection";

const SLOTS_PER_ROW = 4;

export default class TimeSelect extends PureComponent<TimeSelectProps> {
  /** Resolve [open, close] Dates for the selected day from the openHours prop. */
  generateOpenHours(): [Date, Date] | null {
    const { openHours, selectedDate } = this.props;
    const dayStart = dateFns.startOfDay(selectedDate);
    const dayOfWeek = dateFns.getDay(selectedDate);
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    let hours: number[] | undefined;
    if (openHours.length === 1) {
      [hours] = openHours;
    } else if (openHours.length === 2) {
      hours = openHours[isWeekend ? 1 : 0];
    } else if (openHours.length === 7) {
      hours = openHours[dayOfWeek];
    }
    if (!hours || hours.length < 2) return null;

    return [
      dateFns.addHours(dayStart, hours[0]),
      dateFns.addHours(dayStart, hours[1]),
    ];
  }

  isTimeDisabled(time: Date, close: Date): boolean {
    const { bookings, disableHistory } = this.props;
    if (disableHistory && dateFns.isBefore(time, new Date())) return true;
    if (!dateFns.isBefore(time, close)) return true;

    return bookings.some((booking) =>
      dateFns.isWithinRange(
        time,
        booking.start_time,
        dateFns.subMinutes(booking.end_time, 1)
      )
    );
  }

  render() {
    const { timeSlot, selectedTime, onTimeClick } = this.props;
    const openHours = this.generateOpenHours();
    const rows: React.ReactNode[] = [];

    if (openHours && timeSlot > 0) {
      const [open, close] = openHours;
      // Pad the last row out to a full row of slots; the padding renders disabled.
      const slotCount = dateFns.differenceInMinutes(close, open) / timeSlot;
      const padding = (SLOTS_PER_ROW - (slotCount % SLOTS_PER_ROW)) % SLOTS_PER_ROW;
      const last = dateFns.addMinutes(close, timeSlot * padding);

      let timePick = open;
      let timeSlots: React.ReactNode[] = [];
      while (timePick < last) {
        for (let i = 0; i < SLOTS_PER_ROW; i += 1) {
          let classSet = "";
          classSet += isWithinSelection(timePick, selectedTime) ? " selectedTime" : "";
          classSet += this.isTimeDisabled(timePick, close) ? " disabled" : "";

          const cloneTime = timePick;
          timeSlots.push(
            <TimeSlot
              key={cloneTime.toISOString()}
              time={dateFns.format(cloneTime, "HH:mm")}
              classSet={classSet}
              onTimeClick={() => onTimeClick(cloneTime)}
            />
          );
          timePick = dateFns.addMinutes(timePick, timeSlot);
        }
        rows.push(
          <div className="row" key={timePick.toISOString()}>
            {timeSlots}
          </div>
        );
        timeSlots = [];
      }
    }

    return (
      <div className="timeSelector">
        <div className="optionSpacer body">
          <div className="optionHolder">
            {rows.length > 0 ? rows : <p className="closed">Closed</p>}
          </div>
        </div>
      </div>
    );
  }
}
