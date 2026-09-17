import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import {
  addDays,
  format,
  isSameDay,
  isWithinInterval,
  setHours,
  setMinutes,
  startOfDay,
  subMinutes,
} from "date-fns";
import TimeCalendar, { Booking } from "../src";

// Bookings are pinned to tomorrow so the demo always shows blocked slots
// regardless of when you open it.
const tomorrow = startOfDay(addDays(new Date(), 1));
const bookings: Booking[] = [
  {
    id: 1,
    start_time: setHours(tomorrow, 13),
    end_time: setMinutes(setHours(tomorrow, 13), 30),
  },
  {
    id: 2,
    start_time: setHours(tomorrow, 14),
    end_time: setMinutes(setHours(tomorrow, 15), 30),
  },
];

const openHours = [
  [9.5, 15], // weekdays
  [9, 23.5], // weekends
];

function overlapsBooking(start: Date, end: Date): boolean {
  const interval = { start, end };
  return bookings.some(
    (b) =>
      isWithinInterval(b.start_time as Date, interval) ||
      isWithinInterval(subMinutes(b.end_time as Date, 1), interval)
  );
}

function Demo() {
  const [startTime, setStartTime] = useState<Date | "">("");
  const [endTime, setEndTime] = useState<Date | "">("");
  const [lastDay, setLastDay] = useState<Date | null>(null);

  function handleTimeClick(time: Date) {
    if (startTime === "") {
      setStartTime(time);
      return;
    }
    const restart =
      !isSameDay(startTime, time) ||
      time < startTime ||
      overlapsBooking(startTime, time);
    if (restart) {
      setStartTime(time);
      setEndTime("");
      return;
    }
    setEndTime(time);
  }

  const fmt = (d: Date | "") => (d === "" ? "—" : format(d, "EEE d MMM HH:mm"));

  return (
    <>
      <h1>
        <a href="https://github.com/jacobsidford/react-timecalendar">react-timecalendar</a>
      </h1>
      <p className="hint">
        Pick a day, hit <em>Select Time</em>, then click a start and end slot.
        Tomorrow has two existing bookings that block slots.
      </p>
      <TimeCalendar
        disableHistory
        clickable
        timeSlot={30}
        openHours={openHours}
        bookings={bookings}
        startTime={startTime}
        endTime={endTime}
        onDateClick={setLastDay}
        onTimeClick={handleTimeClick}
      />
      <div className="status">
        Day: <code>{lastDay ? format(lastDay, "EEE d MMM yyyy") : "—"}</code>{" "}
        Start: <code>{fmt(startTime)}</code> End: <code>{fmt(endTime)}</code>
      </div>
    </>
  );
}

createRoot(document.getElementById("root")!).render(<Demo />);
