# React Time Calendar

[![CI](https://github.com/jacobsidford/react-timecalendar/actions/workflows/ci.yml/badge.svg)](https://github.com/jacobsidford/react-timecalendar/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/react-timecalendar)](https://www.npmjs.com/package/react-timecalendar)

Lightweight and customizable date/time picker for react.js, simply pass in a callback function to receive selected date, time or time periods of both.
Ideal for building a booking system in React.
![Demo: pick a day, switch to time view, select a range around a booking](./public/images/demo.gif?raw=true "react-timecalendar demo")

## Features

- [Date Selector](#date-selector)
- [Time Selector](#time-selector)
- [Multi-Selection](#multi-selection)
- [Booked Timeslots](#booked-timeslots)
- [Open CSS for styling](#styling)

## Installing / Getting started

```bash
npm install react-timecalendar
# or
yarn add react-timecalendar
```

Online demo available at https://jacobsidford.github.io/react-timecalendar/

## Usage

```js
import React from "react";
import TimeCalendar from "react-timecalendar";

const openHours = [
  [9.5, 15],
  [9, 23.5],
];
function loggingTime(time) {
  console.log(time);
}
const MyCalendar = () => (
  <TimeCalendar
    disableHistory
    clickable
    timeSlot={30}
    openHours={openHours}
    onTimeClick={loggingTime}
  />
);
```

## Options

| Prop             | Type             | Default | Description                                                                 |
| :--------------- | :--------------- | :------ | :-------------------------------------------------------------------------- |
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

Booking times can be `Date` objects or anything date-fns v1 can parse. If in doubt, use `Date`.
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

## Dependencies

[date-fns](https://github.com/date-fns/date-fns) v1

## Licensing

The code in this project is licensed under MIT license.
