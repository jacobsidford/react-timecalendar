import React from 'react';
import ReactDOM from 'react-dom';
import TimeCalendar from './TimeCalendar';

const divStyle=window.innerWidth > 1023 ? {width:'40%'} : {width:'100%'};
function Welcome() {
  return <div style={divStyle}>
  <TimeCalendar
  disableHistory={true}
  timeSelect={true}
  clickable={false}
  />
  </div>;
}
ReactDOM.render(<Welcome />, document.getElementById('root'));
