//@ts-nocheck
import React from "react";
import dateFns from "date-fns";
import { DayTitleProps } from "./types";

type DayTitleState = {
  dateFormat: string;
};

export default class DayTitle extends React.Component<
  DayTitleProps,
  DayTitleState
> {
  constructor(props) {
    super(props);
    this.state = {
      dateFormat: "ddd",
    };
  }

  componentDidMount() {
    this.setState({
      // @ts-ignore
      dateFormat: this.dayTitle.parentNode.clientWidth > 500 ? "dddd" : "ddd",
    });
  }

  render() {
    const { currentMonth } = this.props;
    const { dateFormat } = this.state;
    const days = [];
    const startDate = dateFns.startOfWeek(currentMonth);
    [Array(7)].map((e, i) =>
      days.push(
        <div className="col col-center" key={e}>
          {dateFns.format(dateFns.addDays(startDate, i), dateFormat)}
        </div>
      )
    );
    return (
      <div
        className="days row"
        ref={(c) => {
          // @ts-ignore
          this.dayTitle = c;
        }}
      >
        {days}
      </div>
    );
  }
}
