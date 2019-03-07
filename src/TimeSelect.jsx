import React, { PureComponent } from "react";
import PropTypes from 'prop-types';
import dateFns from "date-fns";
import TimeSlot from './TimeSlot';

const propTypes = {
 selectedDate: PropTypes.instanceOf(Date),
  timeSlot: PropTypes.number,
  openHours: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  onTimeClick: PropTypes.func,
  bookings: PropTypes.arrayOf(PropTypes.string)
};

const defaultProps = {
  selectedDate: new Date(),
  timeSlot: 30,
  onTimeClick: null,
  bookings:['05-10-19', '02-04-19'],
};

export default class TimeSelect extends PureComponent {
  constructor(props) {
   super(props);
   this.state = {selectorClass: 'inactive'};
   this.selectorClick = this.selectorClick.bind(this);
 }

  selectorClick() {
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
        let classSet = '';
        classSet += dateFns.isBefore(timePick, closeTime) ? '' : ' disabled'
        // if (this.props.bookings) classSet += this.props.bookings.includes(timePick) ? ' booked' : ''
        const cloneTime = timePick;
        timeSlots.push(

          <TimeSlot
          key = {cloneTime}
          time = {dateFns.format(cloneTime, dateFormat)}
          classSet = {classSet}
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

    return (
      <div className={'timeSelector'}>
      <p onClick={this.selectorClick}>Make a booking</p>
      <div className={"optionSpacer body"}>
      <div className={"optionHolder " + this.state.selectorClass}>
      {rows}
      </div>
      </div>
      </div>
    );
  }
}

TimeSelect.propTypes = propTypes;
TimeSelect.defaultProps = defaultProps;
