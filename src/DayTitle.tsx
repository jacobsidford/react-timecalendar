import React from "react";
import dateFns from "date-fns";
import it from "date-fns/locale/it";
import { DayTitleProps } from "./types";

type DayTitleState = {
    dateFormat: string;
};

export default class DayTitle extends React.Component<
    DayTitleProps,
    DayTitleState
> {
    constructor(props: DayTitleProps) {
        super(props);
        this.state = {
            dateFormat: "ddd"
        };
    }

    componentDidMount() {
        this.setState({
            // @ts-ignore
            dateFormat:
                this.dayTitle.parentNode.clientWidth > 500 ? "dddd" : "ddd"
        });
    }

    render() {
        const { currentMonth } = this.props;
        const { dateFormat } = this.state;
        const days = [];
        const startDate = dateFns.startOfWeek(currentMonth);
        for (let i = 0; i < 7; i++) {
            days.push(
                <div className="col col-center" key={i}>
                    {dateFns.format(dateFns.addDays(startDate, i), dateFormat, {
                        locale: it
                    })}
                </div>
            );
        }
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
