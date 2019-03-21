
# React Time Calendar
Lightweight and customizable date/time picker for react.js
![Date selection calendar](./public/images/screen1.png?raw=true "Screenshot of calendar")
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
| `openHours`      | array       | `[][]`  | Times slots that will be rendered available.           |
| `disableHistory` | bool        | `true`  | Disable navigating before current month.               |
| `clickable`      | bool        | `true`  | Make days clickable.                                   |
| `timeSlot`       | number      | 30      | Amount of time needed for each booking.                |
| `onDateFunction` | function    | null    | Function called on click of calendar day.              |
| `onTimeFunction` | function    | null    | Function called on click of time slot.                 |
| `bookings`       | array       | '[]'    | TODO :Days/times that will be rendered unavailable     |

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
//7 array's to indicate each day of the week, to not offer timeSlots on that day.
```
To activate time selection, timeSlot and onTimeClick must be provided with clickable being true.
## Styling

CSS class taxonomy:

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
          p
          .col
        }
   }
}

```
### TODO:
- [ ] Take in bookings data and disable relative days/timeslots.
- [ ] Allow multiple timeSlot selection
- [ ] Multiple day selection if not using time picker  

## Dependencies
[react](https://github.com/facebook/react)

[date-fns](https://github.com/date-fns/date-fns)
<!-- ## Usage

Here you should write what are all of the configurations a user can enter when
using the project.

#### Argument 1
Type: `String`  
Default: `'default value'`

State what an argument does and how you can use it. If needed, you can provide
an example below.

Example:
```bash
awesome-project "Some other value"  # Prints "You're nailing this readme!"
```

#### Argument 2
Type: `Number|Boolean`  
Default: 100

Copy-paste as many of these as you need. -->

## Style guide
Following Airbnb's [styling guide](https://github.com/airbnb/javascript/tree/master/react)


## Licensing
The code in this project is licensed under MIT license.
