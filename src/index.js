import React from 'react';
import ReactDOM from 'react-dom';
import TimeCalendar from './TimeCalendar';
import dateFns from "date-fns";

function logging(day) {
  console.log(day)
}
function loggingTime(time) {
  console.log(time);
  console.log(dateFns.format(time, "YY-MM-DD-mm"))
}
const divStyle = window.innerWidth > 1023 ? {width:'40%'} : {width:'100%'};
const openHours = [
  [9.5, 15],
  [9, 23.5]
];
// let bookings = [
//  'Thu Mar 07 2019 14:30:00 GMT+1100 (Australian Eastern Daylight Time)'
// ]
function Welcome() {
  return (
    <div style = {divStyle}>

    <TimeCalendar
    disableHistory
    clickable
    timeSlot = {30}
    onDateFunction = {logging}
    openHours = {openHours}
    onTimeClick = {loggingTime}
    // bookings = {bookings}
    />

    </div>
  );
}
ReactDOM.render(<Welcome />, document.getElementById('root'));
