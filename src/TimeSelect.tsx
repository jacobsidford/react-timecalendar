import React, { PureComponent } from "react";
import {
  addMinutes,
  differenceInMinutes,
  format,
  getDay,
  isBefore,
  isWithinInterval,
  set,
  startOfDay,
  subMinutes,
} from "date-fns";
import TimeSlot from "./TimeSlot";
import { TimeSelectProps } from "./types";
import { isWithinSelection } from "./selection";
import { toDateValue } from "./dates";

const SLOTS_PER_ROW = 4;

export default class TimeSelect extends PureComponent<TimeSelectProps> {
  /** Resolve [open, close] Dates for the selected day from the openHours prop. */
  generateOpenHours(): [Date, Date] | null {
    const { openHours, selectedDate } = this.props;
    const dayStart = startOfDay(selectedDate);
    const dayOfWeek = getDay(selectedDate);
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

    // Wall-clock, not elapsed hours: addHours(startOfDay, 9) lands on 10:00
    // on a spring-forward day.
    const atClock = (decimalHours: number) =>
      set(dayStart, {
        hours: Math.floor(decimalHours),
        minutes: Math.round((decimalHours % 1) * 60),
      });
    return [atClock(hours[0]), atClock(hours[1])];
  }

  isTimeDisabled(time: Date, close: Date): boolean {
    const { bookings, disableHistory } = this.props;
    if (disableHistory && isBefore(time, new Date())) return true;
    if (!isBefore(time, close)) return true;

    return bookings.some((booking) => {
      const start = toDateValue(booking.start_time);
      const end = subMinutes(toDateValue(booking.end_time), 1);
      return start <= end && isWithinInterval(time, { start, end });
    });
  }

  render() {
    const { timeSlot, selectedTime, onTimeClick } = this.props;
    const openHours = this.generateOpenHours();
    const rows: React.ReactNode[] = [];

    if (openHours && timeSlot > 0) {
      const [open, close] = openHours;
      // Pad the last row out to a full row of slots; the padding renders disabled.
      const slotCount = differenceInMinutes(close, open) / timeSlot;
      const padding = (SLOTS_PER_ROW - (slotCount % SLOTS_PER_ROW)) % SLOTS_PER_ROW;
      const last = addMinutes(close, timeSlot * padding);

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
              time={format(cloneTime, "HH:mm")}
              classSet={classSet}
              onTimeClick={() => onTimeClick(cloneTime)}
            />
          );
          timePick = addMinutes(timePick, timeSlot);
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
