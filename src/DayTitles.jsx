import React from 'react';
import PropTypes from 'prop-types';
import dateFns from 'date-fns';

const propTypes = {
  currentMonth: PropTypes.instanceOf(Date),
};

const defaultProps = {
  currentMonth: null,
};

export default class DayTitles extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dateFormat: 'ddd',
    };
  }

  componentDidMount() {
    this.setState({
      dateFormat: this.dayTitles.parentNode.clientWidth > 500 ? 'dddd' : 'ddd',
    });
  }

  render() {
    const { currentMonth } = this.props;
    const { dateFormat } = this.state;
    const days = [];
    const startDate = dateFns.startOfWeek(currentMonth);
    [...Array(7)].map((e, i) => days.push(
      <div className="col col-center" key={e}>

        {dateFns.format(dateFns.addDays(startDate, i), dateFormat)}
      </div>,
    ));
    return (
      <div className="days row" ref={(c) => { this.dayTitles = c; }}>
        {days}
      </div>
    );
  }
}

DayTitles.propTypes = propTypes;
DayTitles.defaultProps = defaultProps;
