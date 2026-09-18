# React Time Calendar

[![CI](https://github.com/jacobsidford/react-timecalendar/actions/workflows/ci.yml/badge.svg)](https://github.com/jacobsidford/react-timecalendar/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/react-timecalendar)](https://www.npmjs.com/package/react-timecalendar)
[![bundle size](https://img.shields.io/bundlephobia/minzip/react-timecalendar)](https://bundlephobia.com/package/react-timecalendar)
[![license](https://img.shields.io/npm/l/react-timecalendar)](./LICENSE)

Lightweight, typed date and time-slot picker for React. Pass in opening hours and existing bookings, get back the `Date` the user picked. Built for booking and appointment UIs.

- ~6 KB minified on top of [date-fns](https://date-fns.org) v4 (tree-shaken, shared with your app)
- TypeScript types included, ESM and CJS builds
- React 16.8 → 19, no other runtime dependencies
- Plain SCSS classes, no CSS-in-JS
![Demo: pick a day, switch to time view, select a range around a booking](./public/images/demo.gif?raw=true "react-timecalendar demo")

## Features

- [Date Selector](#date-selector)
- [Time Selector](#time-selector)
- [Multi-Selection](#multi-selection)
- [Booked Timeslots](#booked-timeslots)
- [Open CSS for styling](#styling)

## Installing / Getting started

```bash
npm install react-timecalendar date-fns
```

`date-fns` v4 is a peer-style dependency: it is declared in `dependencies` so a bare install works, but if your app already uses date-fns v3 or v4 npm will dedupe to a single copy.

Online demo available at https://jacobsidford.github.io/react-timecalendar/

## Usage

```tsx
import TimeCalendar from "react-timecalendar";
// or: import { TimeCalendar } from "react-timecalendar";

const openHours = [
  [9.5, 15], // weekdays 09:30–15:00
  [9, 23.5], // weekends 09:00–23:30
];

export function MyCalendar() {
  return (
    <TimeCalendar
      timeSlot={30}
      openHours={openHours}
      onDateClick={(day: Date) => console.log("day", day)}
      onTimeClick={(time: Date) => console.log("slot", time)}
    />
  );
}
```

Styles are injected automatically on import; no separate CSS file to include.

## Options

| Prop             | Type             | Default | Description                                                                 |
| :--------------- | :--------------- | :------ | :-------------------------------------------------------------------------- |
| `selectedDate`   | Date             | —       | Controlled focused day. Pair with `onSelectedDateChange`.                   |
| `defaultSelectedDate` | Date        | today   | Uncontrolled initial day.                                                   |
| `onSelectedDateChange` | function   | —       | Fires on day click and prev/next navigation with the new `Date`.            |
| `view`           | `"month" \| "day"` | —    | Controlled view. Pair with `onViewChange`. `"day"` needs `openHours`.       |
| `defaultView`    | `"month" \| "day"` | `"month"` | Uncontrolled initial view.                                              |
| `onViewChange`   | function         | —       | Fires when the user toggles between month and day view.                     |
| `disableHistory` | bool             | `true`  | Block navigating to past months/days and disable past days and time slots.  |
| `clickable`      | bool             | `true`  | Make days clickable. `false` renders every day disabled.                    |
| `openHours`      | number[][]       | `[]`    | Opening hours per day, see [Open Hours](#open-hours). Enables time select.  |
| `timeSlot`       | number           | `30`    | Length of each time slot in minutes.                                        |
| `onDateClick`    | function         | —       | Called with the clicked day as a `Date`. (`onDateFunction` still works, deprecated.) |
| `onTimeClick`    | function         | —       | Called with the clicked time slot as a `Date`.                              |
| `bookings`       | Booking[]        | `[]`    | Existing bookings; overlapping slots (or days, without `openHours`) render disabled. |
| `startTime`      | Date \| string   | `""`    | Multi-select: first selected time.                                          |
| `endTime`        | Date \| string   | `""`    | Multi-select: second selected time, must be after `startTime`.              |

### Open Hours

Opening hours can be of varying 24 hour value array lengths, with `[i][0]` being open time and `[i][1]` being closing.

```js
const openHours = [[9.5, 15]];
// Single array means all days open and close at this time.
const openHours = [
  [9.5, 15],
  [9, 23.5],
];
// Double array indicates weekday and weekend hours separately.
const openHours = [
  [9.5, 15],
  [9, 23.5],
  [8, 16],
  [8.5, 18],
  [10, 10],
  [0, 0],
  [9, 17],
];
// 7 arrays to indicate each day of the week, Sunday first.
// To set yourself as closed on a day, open == close
// Any other length renders "Closed".
```

To activate time selection `openHours` must be provided (`timeSlot` defaults to 30).
Slots are laid out four per row; the last row is padded with disabled slots.

Requires React 16.8 or newer (18 and 19 supported).

## Styling

To allow for styling I've used SCSS instead of styled components to make it easy
to make style changes
SCSS class taxonomy:

```sass
.calendar{
   .days
   .header{
        .icon
    }
  .body{
    .row{
      .col
      .cell{
        .number
        .bg
      }
      .today
      .selected
      .disabled
      .selectedTime
      .Sun .Mon .Tue .Wed .Thu .Fri .Sat
    }
  }
  .timeSelector{
    p
    .optionSpacer
    .optionHolder{
      .col
      .closed
    }
  }
}

```

## Complete booking flow

Everything in one place: opening hours, existing bookings blocked out, a start/end range
that resets if it would span a booking, the calendar controlled from state so it can be
deep-linked, and the result ready to POST. Copy this and replace the `bookings` fetch.

```tsx
import { useState } from "react";
import { isSameDay } from "date-fns";
import TimeCalendar, { type Booking, type CalendarView } from "react-timecalendar";

const openHours = [
  [9, 17],   // Mon–Fri 09:00–17:00
  [10, 14],  // Sat–Sun 10:00–14:00
];

type Range = { start: Date | ""; end: Date | "" };

export function BookingPicker({ bookings }: { bookings: Booking[] }) {
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [view, setView] = useState<CalendarView>("month");
  const [range, setRange] = useState<Range>({ start: "", end: "" });

  // True if any booking overlaps [start, end]. end is the start of the last
  // selected slot, so it counts as inclusive.
  const spansBooking = (start: Date, end: Date) =>
    bookings.some(
      (b) => new Date(b.start_time) <= end && new Date(b.end_time) > start
    );

  function handleTimeClick(time: Date) {
    const { start } = range;
    if (start === "" || !isSameDay(start, time) || time < start || spansBooking(start, time)) {
      setRange({ start: time, end: "" });
    } else {
      setRange({ start, end: time });
    }
  }

  async function confirm() {
    if (range.start === "" || range.end === "") return;
    await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Slots are browser-local Dates; toISOString() sends them as UTC.
      body: JSON.stringify({ start: range.start.toISOString(), end: range.end.toISOString() }),
    });
  }

  return (
    <>
      <TimeCalendar
        selectedDate={selectedDate}
        onSelectedDateChange={setSelectedDate}
        view={view}
        onViewChange={setView}
        openHours={openHours}
        timeSlot={30}
        bookings={bookings}
        startTime={range.start}
        endTime={range.end}
        onTimeClick={handleTimeClick}
      />
      <button type="button" disabled={range.end === ""} onClick={confirm}>
        Book {range.start && range.end ? `${range.start.toLocaleTimeString()}–${range.end.toLocaleTimeString()}` : ""}
      </button>
    </>
  );
}
```

Notes:

- `selectedDate` and `view` are optional. Leave them out for an uncontrolled calendar, or pass `defaultSelectedDate` / `defaultView` to set the initial state only.
- The range end is inclusive of the clicked slot's start time. To book 09:00–10:00 with 30-minute slots the user clicks 09:00 then 09:30; add `timeSlot` minutes to `range.end` before saving if you want the slot's end.
- All times are the browser's local timezone. Convert on the server if bookings are shared across regions.

## Feature demos

#### Date Selector

Standard calendar for selecting a date. onDateClick returns the selected date object.

```js
<TimeCalendar clickable onDateClick={this.handleDateClick} />
```

#### Time Selector

Allows selection of time slots for selected day, takes into account [open hours](#open-hours) and breaks them up into slots by dividing them via timeSlot. onTimeClick returns the selected time object.

```js
const openHours = [[9.5, 15]];
<TimeCalendar
  clickable
  timeSlot={30}
  openHours={openHours}
  onTimeClick={this.handleTimeClick}
/>;
```

#### Multi Selection

The calendar also supports selection of multiple time slots or days at once to allow
extended bookings, this is done by passing in startTime and endTime props and a function
which updates these values. A starting point using date-fns is below.

To change from multiple time slots to multiple days, remove `!dateFns.isSameDay(this.state.startTime, time) ||` from handleTimeClick and change the props to pass the function to onDateClick instead of onTimeClick.

```js
class DemoCalendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startTime: "",
      endTime: "",
    };
    this.handleTimeClick = this.handleTimeClick.bind(this);
  }
  handleTimeClick(time) {
    if (this.state.startTime === "") {
      this.setState({
        startTime: time,
      });
    } else if (
      !dateFns.isSameDay(this.state.startTime, time) ||
      time < this.state.startTime
    ) {
      this.setState({
        startTime: "",
        endTime: "",
      });
    } else {
      this.setState({
        endTime: time,
      });
    }
  }

  render() {
    const openHours = [[9.5, 15]];
    return (
      <div>
        <TimeCalendar
          clickable
          timeSlot={30}
          openHours={openHours}
          onTimeClick={this.handleTimeClick}
          startTime={this.state.startTime}
          endTime={this.state.endTime}
        />
      </div>
    );
  }
}
```

#### Booked Timeslots

Calendar can receive an array of bookings and will then add `.disabled` to slots from
`start_time` (inclusive) up to `end_time` (exclusive). Without `openHours`, whole days
that overlap a booking are disabled instead. The component does not stop a multi-selection
spanning a booking; see `demo/main.tsx` for a `handleTimeClick` that resets when it does.

Booking times can be `Date` objects, epoch milliseconds, or ISO-8601 strings (`"2030-03-27 13:00:00"` and `"2030-03-27T13:00:00Z"` both parse). If in doubt, use `Date`.
Note `disableHistory` (default `true`) hides past dates, so bookings in the past never show.

```js
render () {
  const openHours = [
    [9.5, 15]
  ];
  const bookings = [
          {
            id: 1,
            start_time: "2030-03-27 13:00:00",
            end_time: "2030-03-27 13:30:00"
          },
          {
            id: 2,
            start_time: "2030-03-27 14:00:00",
            end_time: "2030-03-27 15:30:00",
          }
        ];

  return(
    <div>
      <TimeCalendar
        clickable
        timeSlot = {30}
        openHours = {openHours}
        onTimeClick = {this.handleTimeClick}
        bookings = {bookings}
        startTime = {this.state.startTime}
        endTime = {this.state.endTime}
        />
    </div>
  );
}
```

### TODO:

- [ ] Allow onClick URL's in bookings displayed on calendar

## Development

```bash
npm install
npm run dev         # demo at http://localhost:5173/react-timecalendar/
npm test            # vitest + testing-library
npm run build       # library → build/
npm run build:demo  # demo site → dist-demo/
```

The demo deploys to GitHub Pages automatically on every push to `master`.

## Upgrading from 2.x

3.0.0 moves from date-fns v1 to v4 and stops bundling it.

- Install `date-fns` alongside (`npm install date-fns`). If you were relying on the copy bundled inside 2.x, it is gone.
- `bookings`, `startTime` and `endTime` still accept strings, but they must now be ISO-8601. Free-form strings that date-fns v1 happened to parse (e.g. `"March 27 2030"`) are not supported.
- Bundle drops from ~190 KB to ~12 KB before minification.
- The component is also available as a named export.

Everything else in the props table is unchanged from 2.2.

## Dependencies

[date-fns](https://github.com/date-fns/date-fns) v4

## Licensing

The code in this project is licensed under MIT license.
