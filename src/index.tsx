//@ts-nocheck
import React, { PureComponent } from "react";
import dateFns from "date-fns";
import it from "date-fns/locale/it";
import Header from "./Header";
import Weeks from "./Weeks";
import TimeSelect from "./TimeSelect";
import { TimeCalendarProps } from "./types";
import "./App.scss";

type TimeCalendarState = {
    selectedDate: Date;
    timeSelect: boolean;
};

export default class TimeCalendar extends PureComponent<
    TimeCalendarProps,
    TimeCalendarState
> {
    constructor(props) {
        super(props);
        this.state = {
            selectedDate: new Date(),
            timeSelect: false
        };
        this.onDateClick = this.onDateClick.bind(this);
        this.nextTime = this.nextTime.bind(this);
        this.prevTime = this.prevTime.bind(this);
        this.timeSelectToggle = this.timeSelectToggle.bind(this);
    }

    onDateClick(day: Date) {
        const { onDateFunction } = this.props;
        this.setState({
            selectedDate: day
        });
        if (onDateFunction) onDateFunction(day);
    }

    nextTime() {
        const { selectedDate, timeSelect } = this.state;
        this.setState({
            selectedDate: timeSelect
                ? dateFns.addDays(selectedDate, 1)
                : dateFns.addMonths(selectedDate, 1)
        });
    }

    prevTime() {
        const { selectedDate, timeSelect } = this.state;
        const { disableHistory } = this.props;

        if (
            disableHistory &&
            ((dateFns.isPast(dateFns.startOfMonth(selectedDate)) &&
                !timeSelect) ||
                (dateFns.isPast(dateFns.startOfDay(selectedDate)) &&
                    timeSelect))
        )
            return;

        this.setState({
            selectedDate: timeSelect
                ? dateFns.subDays(selectedDate, 1)
                : dateFns.subMonths(selectedDate, 1)
        });
    }

    timeSelectToggle() {
        const { timeSelect } = this.state;
        this.setState({
            timeSelect: !timeSelect
        });
    }

    render() {
        const {
            disableHistory,
            timeSlot,
            openHours,
            onTimeClick,
            bookings,
            startTime,
            endTime,
            clickable
        } = this.props;
        const { selectedDate, timeSelect } = this.state;
        return (
            <div className="calendar">
                <Header
                    selectedDate={
                        (!timeSelect
                            ? dateFns.format(selectedDate, "MMMM YYYY", {
                                  locale: it
                              })
                            : dateFns.format(selectedDate, "dddd Do MMMM"),
                        { locale: it })
                    }
                    nextTime={this.nextTime}
                    prevTime={this.prevTime}
                    timeSelect={timeSelect}
                />
                {timeSelect ? (
                    <>
                        <TimeSelect
                            selectedDate={selectedDate}
                            disableHistory={disableHistory}
                            timeSlot={timeSlot}
                            openHours={openHours}
                            onTimeClick={onTimeClick}
                            bookings={bookings}
                            selectedTime={{ start: startTime, end: endTime }}
                        />
                    </>
                ) : (
                    <>
                        <Weeks
                            selectedDate={selectedDate}
                            disableHistory={disableHistory}
                            onDateClick={this.onDateClick}
                            bookings={bookings}
                            timeSlot={timeSlot}
                            clickable={clickable}
                            selectedTime={{ start: startTime, end: endTime }}
                        />
                    </>
                )}
                {timeSlot && openHours && (
                    <button
                        className="timeSelector"
                        onClick={this.timeSelectToggle}
                        type="button"
                    >
                        <p>
                            {timeSelect
                                ? "Scegli un'altra data"
                                : "Select Time"}
                        </p>
                    </button>
                )}
            </div>
        );
    }
}
