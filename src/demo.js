import React from 'react';
import ReactDOM from 'react-dom';
import dateFns from 'date-fns';
import TimeCalendar from '.';

class Welcome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startTime: '',
      endTime: '',
      bookings: [
        {
          id: 1,
          start_time: '2020-03-27 13:00:00',
          end_time: '2020-03-27 13:30:00',
        },
        {
          id: 2,
          start_time: '2020-03-27 14:00:00',
          end_time: '2020-03-27 15:30:00',
        },
      ],
    };
    this.handleTimeClick = this.handleTimeClick.bind(this);
  }

  handleTimeClick(time) {
    if (this.state.startTime === '') {
      this.setState({
        startTime: time,
      });
    } else if (!dateFns.isSameDay(this.state.startTime, time) || time < this.state.startTime) {
      this.setState({
        startTime: '',
        endTime: '',
      });
    }

    let interceptingBooking = false;
    if (time > this.state.startTime) {
      { this.state.bookings.map((booking) => (dateFns.isWithinRange(booking.start_time, this.state.startTime, time)
        || dateFns.isWithinRange(dateFns.subMinutes(booking.end_time, 1), this.state.startTime, time)
        ? interceptingBooking = true : '')); }
    }

    if (!interceptingBooking) {
      this.setState({
        endTime: time,
      });
    }
  }

  render() {
    const divStyle = window.innerWidth > 1023 ? { width: '55%' } : { width: '100%' };
    const openHours = [
      [9.5, 15],
      [9, 23.5],
    ];
    return (
      <div style={divStyle}>

        <TimeCalendar
          disableHistory
          clickable
          timeSlot={30}
          startTime={this.state.startTime}
          endTime={this.state.endTime}
          openHours={openHours}
          onTimeClick={this.handleTimeClick}
          bookings={this.state.bookings}
        />

      </div>
    );
  }
}

export default Welcome;

ReactDOM.render(
  <Welcome />,
  document.getElementById('root'),
);
