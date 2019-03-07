import React from "react";
import PropTypes from 'prop-types';
import dateFns from "date-fns";
import TimeSlot from './TimeSlot';

export default class TimeSelect extends React.Component {
  state = {
    selectorClass: 'inactive',
  };

  selectorClick = () => {
    this.setState({
      selectorClass: this.state.selectorClass === 'inactive' ? 'active' : 'inactive'
    });
  };

  render(){
    const openHours = this.props.openHours;
    const timeSlot = this.props.timeSlot;
    const dayStart = dateFns.startOfDay(this.props.selectedDate);
    let dayNum = parseInt(dateFns.format(this.props.selectedDate, 'd'));
    let openTime = dayStart;
    let closeTime = dateFns.endOfDay(dayStart);

    if(openHours.length === 1){
      openTime=dateFns.addHours(dayStart, openHours[0][0]);
      closeTime=dateFns.addHours(dayStart, openHours[0][1]);
    }
    else if(openHours.length === 2) {
      if(dayNum === 0 || dayNum === 6) {
        openTime=dateFns.addHours(dayStart, openHours[1][0]);
        closeTime=dateFns.addHours(dayStart, openHours[1][1]);
      }
      else {
        openTime=dateFns.addHours(dayStart, openHours[0][0]);
        closeTime=dateFns.addHours(dayStart, openHours[0][1]);
      }
    }
    else if(openHours.length === 7){
      openTime=dateFns.addHours(dayStart, openHours[dayNum][0]);
      closeTime=dateFns.addHours(dayStart, openHours[dayNum][1])
    }

    const dateFormat = 'HH-mm';
    const rows = [];
    let timePick = openTime;
    let timeSlots = [];
    let difference = dateFns.differenceInMinutes(closeTime, openTime) / timeSlot % 4;
    while(timePick < dateFns.addMinutes(closeTime, timeSlot * difference)){
      for (let i = 0; i < 4; i++) {
        let className = '';
        className += dateFns.isBefore(timePick, closeTime) ? '' : ' disabled'
        // if (this.props.bookings) className += this.props.bookings.includes(timePick) ? ' booked' : ''
        const cloneTime = timePick;
        timeSlots.push(

          <TimeSlot
          key = {cloneTime}
          time = {dateFns.format(cloneTime, dateFormat)}
          className = {className}
          onTimeClick = {() => this.props.onTimeClick(cloneTime)}
          >
          </TimeSlot>
        );
        timePick = dateFns.addMinutes(timePick, 30);
      }
      rows.push(
        <div className="row" key={timePick}>
        {timeSlots}
        </div>
      );
      timeSlots = [];
    }
    return <div className={'timeSelector'}>
    <p onClick={this.selectorClick}>Make a booking</p>
    <div className={"optionSpacer body"}>
    <div className={"optionHolder " + this.state.selectorClass}>
    {rows}
    </div>
    </div>
    </div>;
  }
}


TimeSelect.propTypes = {
  selectedDate: PropTypes.instanceOf(dateFns),
  timeSlot: PropTypes.number,
  openHours: PropTypes.arrayOf(PropTypes.number),
  onTimeClick: PropTypes.func,
};
//
// TimeSelect.defaultProps = {
// selectedDate: PropTypes.instanceOf(dateFns),
// timeSlot: PropTypes.number,
// openHours: openHours[1][1],
// onTimeClick: PropTypes.func,
// };
