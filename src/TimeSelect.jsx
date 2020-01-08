import React, { PureComponent } from "react";
import PropTypes from 'prop-types';
import dateFns from "date-fns";
import TimeSlot from './TimeSlot';

const propTypes = {
  disableHistory: PropTypes.bool,
  selectedDate: PropTypes.instanceOf(Date),
  timeSlot: PropTypes.number,
  openHours: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  onTimeClick: PropTypes.func,
  bookings: PropTypes.arrayOf(PropTypes.object)
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
    this.generateOpenHours = this.generateOpenHours.bind(this);
  }

  selectorClick() {
    this.setState({
      selectorClass: this.state.selectorClass === 'inactive' ? 'active' : 'inactive'
    });
  };

  generateOpenHours() {
    const openTimes = [];
    const openHours = this.props.openHours;
    const dayStart = dateFns.startOfDay(this.props.selectedDate);
    const dayNum = parseInt(dateFns.format(this.props.selectedDate, 'd'));
    if(openHours.length === 1){
      openTimes[0]=dateFns.addHours(dayStart, openHours[0][0]);
      openTimes[1]=dateFns.addHours(dayStart, openHours[0][1]);
    }
    else if(openHours.length === 2) {
      if(dayNum === 0 || dayNum === 6) {
        openTimes[0]=dateFns.addHours(dayStart, openHours[1][0]);
        openTimes[1]=dateFns.addHours(dayStart, openHours[1][1]);
      }
      else {
        openTimes[0]=dateFns.addHours(dayStart, openHours[0][0]);
        openTimes[1]=dateFns.addHours(dayStart, openHours[0][1]);
      }
    }
    else if(openHours.length === 7){
      openTimes[0]=dateFns.addHours(dayStart, openHours[dayNum][0]);
      openTimes[1]=dateFns.addHours(dayStart, openHours[dayNum][1])
    }
    return openTimes;
  }

  render(){
    const timeSlot = this.props.timeSlot;
    const dateFormat = 'HH-mm';
    const rows = [];
    const openHours = this.generateOpenHours();
    let timeSlots = [];
    let timePick = openHours[0];
    const difference = dateFns.differenceInMinutes(openHours[1], openHours[0]) / timeSlot % 4;
    while(timePick < dateFns.addMinutes(openHours[1], timeSlot * difference)){
      for (let i = 0; i < 4; i++) {
        let classSet;
        classSet += dateFns.isBefore(timePick, openHours[1]) ? '' : ' disabled';
        classSet += dateFns.isWithinRange(timePick, this.props.startTime, this.props.endTime) ? ' selectedTime' : '';
        if(this.props.disableHistory)classSet += dateFns.isBefore(timePick, new Date()) ? ' disabled' : '';
        {this.props.bookings.map( (booking) =>
          classSet += dateFns.isWithinRange(timePick, booking.start_time, dateFns.subMinutes(booking.end_time, 1)) ? ' disabled' : '',
        )}
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
