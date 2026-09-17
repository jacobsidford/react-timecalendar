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
  private dayTitle: HTMLDivElement | null = null;

  constructor(props: DayTitleProps) {
    super(props);
    this.state = {
      dateFormat: "ddd",
    };
  }

  componentDidMount() {
    const parent = this.dayTitle?.parentElement;
    this.setState({
      dateFormat: parent && parent.clientWidth > 500 ? "dddd" : "ddd",
    });
  }

  render() {
    const { currentMonth } = this.props;
    const { dateFormat } = this.state;
    const days = [];
    const startDate = dateFns.startOfWeek(currentMonth);
    for (let i = 0; i < 7; i += 1) {
      days.push(
        <div className="col col-center" key={i}>
          {dateFns.format(dateFns.addDays(startDate, i), dateFormat)}
        </div>
      );
    }
    return (
      <div
        className="days row"
        ref={(c) => {
          this.dayTitle = c;
        }}
      >
        {days}
      </div>
    );
  }
}
