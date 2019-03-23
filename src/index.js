import React from 'react';
import ReactDOM from 'react-dom';
import TimeCalendar from './TimeCalendar';
import dateFns from "date-fns";

class Welcome extends React.Component {
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
    const divStyle = window.innerWidth > 1023 ? {width:'40%'} : {width:'100%'};
    const openHours = [
      [9.5, 15],
      [9, 23.5],
      [8, 16],
      [8.5, 18],
      [10, 10],
      [0, 0],
      [9, 17]
    ];
    return(
      <div style = {divStyle}>

        <TimeCalendar
          disableHistory
          clickable
          timeSlot = {30}
          startTime = {this.state.startTime}
          endTime = {this.state.endTime}
          openHours = {openHours}
          onTimeClick = {this.handleTimeClick}
          />

      </div>
    );
  }

}

export default Welcome;

ReactDOM.render(<Welcome />, document.getElementById('root'));
