import React, { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { addMonths, format, isSameDay, isSameMonth, startOfDay, addDays } from "date-fns";
import TimeCalendar, { CalendarView } from "../index";

const openHours = [[9, 12]];
const nextMonth = addMonths(new Date(), 1);
const monthTitle = (d: Date) => format(d, "MMMM yyyy");

describe("selectedDate", () => {
  it("defaultSelectedDate sets the initial month and stays uncontrolled", () => {
    render(<TimeCalendar defaultSelectedDate={nextMonth} />);
    expect(screen.getByText(monthTitle(nextMonth))).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Next"));
    expect(screen.getByText(monthTitle(addMonths(nextMonth, 1)))).toBeInTheDocument();
  });

  it("controlled selectedDate is not changed by navigation, only reported", () => {
    const onSelectedDateChange = vi.fn();
    render(
      <TimeCalendar selectedDate={nextMonth} onSelectedDateChange={onSelectedDateChange} />
    );
    fireEvent.click(screen.getByLabelText("Next"));
    expect(screen.getByText(monthTitle(nextMonth))).toBeInTheDocument();
    expect(onSelectedDateChange).toHaveBeenCalledTimes(1);
    expect(isSameMonth(onSelectedDateChange.mock.calls[0][0], addMonths(nextMonth, 1))).toBe(true);
  });

  it("controlled selectedDate follows the parent", () => {
    function Parent() {
      const [d, setD] = useState(nextMonth);
      return <TimeCalendar selectedDate={d} onSelectedDateChange={setD} />;
    }
    render(<Parent />);
    fireEvent.click(screen.getByLabelText("Next"));
    expect(screen.getByText(monthTitle(addMonths(nextMonth, 1)))).toBeInTheDocument();
  });

  it("day click fires onSelectedDateChange and onDateClick with the same day", () => {
    const onSelectedDateChange = vi.fn();
    const onDateClick = vi.fn();
    render(
      <TimeCalendar
        defaultSelectedDate={nextMonth}
        onSelectedDateChange={onSelectedDateChange}
        onDateClick={onDateClick}
      />
    );
    const target = startOfDay(addDays(nextMonth, 0));
    const cell = screen
      .getAllByRole("gridcell")
      .find((c) => !c.className.includes("disabled") && c.querySelector(".number")?.textContent === format(target, "d"))!;
    fireEvent.click(cell);
    expect(isSameDay(onSelectedDateChange.mock.calls[0][0], target)).toBe(true);
    expect(isSameDay(onDateClick.mock.calls[0][0], target)).toBe(true);
  });
});

describe("view", () => {
  it("defaultView='day' opens on the time slots", () => {
    render(<TimeCalendar defaultView="day" openHours={openHours} defaultSelectedDate={nextMonth} />);
    expect(screen.getByText("09:00")).toBeInTheDocument();
    expect(screen.getByText("Select Day")).toBeInTheDocument();
  });

  it("controlled view ignores the toggle and reports the intent", () => {
    const onViewChange = vi.fn();
    render(<TimeCalendar view="month" onViewChange={onViewChange} openHours={openHours} />);
    fireEvent.click(screen.getByText("Select Time"));
    expect(screen.queryByText("09:00")).not.toBeInTheDocument();
    expect(onViewChange).toHaveBeenCalledWith("day");
  });

  it("controlled view follows the parent", () => {
    function Parent() {
      const [v, setV] = useState<CalendarView>("month");
      return <TimeCalendar view={v} onViewChange={setV} openHours={openHours} defaultSelectedDate={nextMonth} />;
    }
    render(<Parent />);
    fireEvent.click(screen.getByText("Select Time"));
    expect(screen.getByText("09:00")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Select Day"));
    expect(screen.queryByText("09:00")).not.toBeInTheDocument();
  });

  it("view='day' without openHours falls back to month view", () => {
    render(<TimeCalendar view="day" defaultSelectedDate={nextMonth} />);
    expect(screen.getByText(monthTitle(nextMonth))).toBeInTheDocument();
    expect(screen.queryByText("Select Day")).not.toBeInTheDocument();
  });

  it("prev/next step by day in day view and by month in month view", () => {
    const onSelectedDateChange = vi.fn();
    render(
      <TimeCalendar
        defaultView="day"
        openHours={openHours}
        defaultSelectedDate={nextMonth}
        onSelectedDateChange={onSelectedDateChange}
      />
    );
    fireEvent.click(screen.getByLabelText("Next"));
    const afterDayStep = addDays(nextMonth, 1);
    expect(isSameDay(onSelectedDateChange.mock.calls[0][0], afterDayStep)).toBe(true);
    fireEvent.click(screen.getByText("Select Day"));
    fireEvent.click(screen.getByLabelText("Next"));
    // Month step starts from the already-advanced day (matters when nextMonth is the 31st).
    expect(isSameMonth(onSelectedDateChange.mock.calls[1][0], addMonths(afterDayStep, 1))).toBe(true);
  });
});

describe("review regressions", () => {
  it("view='day' without openHours navigates by month, not by day", () => {
    const onSelectedDateChange = vi.fn();
    render(
      <TimeCalendar view="day" defaultSelectedDate={nextMonth} onSelectedDateChange={onSelectedDateChange} />
    );
    fireEvent.click(screen.getByLabelText("Next"));
    expect(isSameMonth(onSelectedDateChange.mock.calls[0][0], addMonths(nextMonth, 1))).toBe(true);
  });

  it("view='day' without openHours lets Previous step back to a future month", () => {
    const onSelectedDateChange = vi.fn();
    render(
      <TimeCalendar
        view="day"
        selectedDate={addMonths(new Date(), 2)}
        onSelectedDateChange={onSelectedDateChange}
      />
    );
    fireEvent.click(screen.getByLabelText("Previous"));
    expect(onSelectedDateChange).toHaveBeenCalledTimes(1);
    expect(isSameMonth(onSelectedDateChange.mock.calls[0][0], nextMonth)).toBe(true);
  });

  it("dropping a controlled selectedDate keeps the last value", () => {
    const { rerender } = render(<TimeCalendar selectedDate={nextMonth} />);
    rerender(<TimeCalendar />);
    expect(screen.getByText(monthTitle(nextMonth))).toBeInTheDocument();
  });

  it("dropping a controlled view keeps the last value", () => {
    const { rerender } = render(
      <TimeCalendar view="day" openHours={openHours} defaultSelectedDate={nextMonth} />
    );
    rerender(<TimeCalendar openHours={openHours} defaultSelectedDate={nextMonth} />);
    expect(screen.getByText("09:00")).toBeInTheDocument();
  });

  it("open hours are wall-clock, including on DST transition days", () => {
    // Renders the day view for every day in the next 400 days and checks the
    // first slot label is always the configured opening time.
    const onViewChange = vi.fn();
    for (let i = 1; i <= 400; i += 1) {
      const day = startOfDay(addDays(new Date(), i));
      const { unmount } = render(
        <TimeCalendar view="day" selectedDate={day} openHours={[[9.5, 12]]} onViewChange={onViewChange} />
      );
      expect(screen.getByText("09:30"), format(day, "yyyy-MM-dd")).toBeInTheDocument();
      unmount();
    }
  });
});
