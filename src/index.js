import React from 'react';
import ReactDOM from 'react-dom';
import TimeCalendar from './TimeCalendar';


function Welcome() {
  return <TimeCalendar
  disableHistory={true}
  />;
}
ReactDOM.render(<Welcome />, document.getElementById('root'));
