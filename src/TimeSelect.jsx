import React from "react";
import PropTypes from 'prop-types';
import dateFns from "date-fns";


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
    return <div className={'timeSelector'}>
    <p onClick={this.selectorClick}>Make a booking</p>
    <div className={"optionSpacer body"}>
    <div className={"optionHolder " + this.state.selectorClass}>
      <div className={"row"}>
      <div className={"col cell"}><p> List item 1 </p></div>
      <div className={"col cell"}><p> List item 1 </p></div>
      <div className={"col cell"}><p> List item 1 </p></div>
      <div className={"col cell"}><p> List item 1 </p></div>
      <div className={"col cell"}><p> List item 1 </p></div>
      </div>
      <div className={"row"}>
        <div className={"col cell"}><p> List item 1 </p></div>
        <div className={"col cell"}><p> List item 1 </p></div>
        <div className={"col cell"}><p> List item 1 </p></div>
      </div>
    </div>

    </div>
    </div>;
  }
}


// TimeSelect.propTypes = {
//   currentMonth: PropTypes.instanceOf(dateFns),
//   selectedDate: PropTypes.instanceOf(dateFns),
//   onDateClick: PropTypes.func,
//   clickable: PropTypes.bool,
// };
//
// TimeSelect.defaultProps = {
//   currentMonth: null,
//   selectedDate: null,
//   onDateClick: null,
//   clickable: true,
// };
