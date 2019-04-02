
# React Time Calendar
Lightweight and customizable date/time picker for react.js, simply pass in a callback function to receive selected date, time or time periods of both.
Ideal for building a booking system in React.
![Date selection calendar](./public/images/screen1.png?raw=true "Screenshot of calendar")
## Features
- [Date Selector](#date-selector)
- [Time Selector](#time-selector)
- [Multi-Selection](#multi-selection)
- [Booked Timeslots](#booked-timeslots)
- [Open CSS for styling](#styling)

## Try it out
```bash
$ git clone https://github.com/jacobsidford/react-timecalendar.git
$ cd react-TimeCalendar
$ npm install
$ npm start
```
Server will start on http://localhost:3000/

Online version available at https://jacobsidford.github.io/react-timecalendar/

## Installing / Getting started

```bash
npm install --save react-timecalendar
```

## Usage

```js
import React from 'react';
import TimeCalendar from 'react-timecalendar';

const openHours = [
  [9.5, 15],
  [9, 23.5]
];
function loggingTime(time) {
  console.log(time);
}
const MyCalendar = () => (
  <TimeCalendar
  disableHistory
  clickable
  timeSlot = {30}
  openHours = {openHours}
  onTimeClick = {loggingTime}
  />
);
```
## Options

| Prop             | Type        | Default | Description                                            |
| :--------------- | :---------- | :------ | :----------------------------------------------------- |
| `disableHistory` | bool        | `true`  | Disable navigating before current month.               |
| `clickable`      | bool        | `true`  | Make days clickable.                                   |
| `localTz`        | bool        | `true`  | TODO:Converts provided booking times to local timezone |
| `openHours`      | array       | `[][]`  | Times slots that will be rendered available.           |
| `timeSlot`       | number      | 30      | Amount of time needed for each booking.                |
| `onDateFunction` | function    | null    | Function called on click of calendar day, returns day  |
| `onTimeFunction` | function    | null    | Function called on click of time slot, returns time    |
| `bookings`       | array       | '[]'    | Times that will be rendered unavailable                |
| `startTime`      | object      | null    | MultiPick: First time selected                         |
| `endTime`        | object      | null    | MultiPick: Second time selected, must be > first time  |

### Open Hours
Opening hours can be of varying 24 hour value array lengths, with `[i][0]` being open time and `[i][1]` being closing.
```js
const openHours = [
  [9.5, 15]
];
// Single array means all days open and close at this time.
const openHours = [
  [9.5, 15],
  [9, 23.5]
];
// Double array indicates weekday and weekend hours separately.
const openHours = [
  [9.5, 15],
  [9, 23.5],
  [8, 16],
  [8.5, 18],
  [10, 10],
  [0, 0],
  [9, 17]
];
// 7 array's to indicate each day of the week.
// To set yourself as closed on a day, open == close
```
To activate time selection timeSlot and openHours must be provided.
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
      .selected
      .disabled
      .selectedTime
      .sun
      .mon
      .tue
      .wed
      .thu
      .fri
      .sat
      .cell{
        .number
        .bg
        }
    }
  .timeSelector{
        p
        .active
        .inactive
        .optionSpacer
        .optionHolder{
          .col
        }
   }
}

```
## Feature Demo's:
#### Date Selector
Standard calendar for selecting a date. onDateClick returns the selected date object.
```js
<TimeCalendar
clickable
onDateClick = {this.handleDateClick}
/>
```
#### Time Selector
Allows selection of time slots for selected day, takes into account [open hours](#open-hours) and breaks them up into slots by dividing them via timeSlot. onTimeClick returns the selected time object.
```js
const openHours = [
  [9.5, 15]
];
<TimeCalendar
clickable
timeSlot = {30}
openHours = {openHours}
onTimeClick = {this.handleTimeClick}
/>
```
#### Multi Selection
The calendar also supports selection of multiple time slots or days at once to allow
extended bookings, this is done by passing in startTime and endTime props and a function
which updates these values. A starting point using date-fns is below.

To change from multiple time slots to multiple days, remove `!dateFns.isSameDay(this.state.startTime, time) ||` from handleTimeClick and change the props to pass the function to onDateClick instead of onTimeClick.
```js
class DemoCalendar extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      startTime: '',
      endTime: ''
    };
    this.handleTimeClick = this.handleTimeClick.bind(this);
  }
  handleTimeClick(time) {
    if(this.state.startTime === ''){
      this.setState({
        startTime: time
      });
    }
    else if (!dateFns.isSameDay(this.state.startTime, time) || time<this.state.startTime){
      this.setState({
        startTime: '',
        endTime: ''
      });
    }
    else{
      this.setState({
        endTime: time
      });
    }
  };

  render () {
    const openHours = [
      [9.5, 15]
    ];
    return(
      <div>
        <TimeCalendar
          clickable
          timeSlot = {30}
          openHours = {openHours}
          onTimeClick = {this.handleTimeClick}
          startTime = {this.state.startTime}
          endTime = {this.state.endTime}
          />
      </div>
    );
  }
}
```
#### Booked Timeslots
Calendar can receive an array of bookings and will then add .disabled to times which
are within the inclusive booked times provided. You can do an edit of the handleTimeClick
function above to make sure the bookings cannot be included in a multi selection booking.

The booking times can come in multiple formats as they're parsed
by dateFns. If there's any errors, try using Javascript Date objects.
```js
render () {
  const openHours = [
    [9.5, 15]
  ];
  const bookings = [
          {
            id: 1,
            start_time: "2019-03-27 13:00:00",
            end_time: "2019-03-27 13:30:00"
          },
          {
            id: 2,
            start_time: "2019-03-27 07:00:00",
            end_time: "2019-03-27 07:30:00",
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
- [x] Take in bookings data and disable relative timeslots
- [ ] Bookings also disable days if timeslots not available
- [x] Allow multiple timeSlot selection
- [x] Multiple day selection if not using time picker  
- [ ] Allow onClick URL's in bookings displayed on calendar
- [ ] Potentially make time selection appear as a modal/dialog for better UX
- [ ] Local timezone conversion option
- [ ] Clean up code (recent features were rushed as this is part of a build)

## Dependencies
[react](https://github.com/facebook/react)

[date-fns](https://github.com/date-fns/date-fns)
## Style guide
Following Airbnb's [styling guide](https://github.com/airbnb/javascript/tree/master/react)


## Licensing
The code in this project is licensed under MIT license.
