import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  addDays,
  format,
  isSameDay,
  isSameMonth,
  setHours,
  setMinutes,
  startOfDay,
} from "date-fns";
import TimeCalendar from "../index";

const tomorrow = startOfDay(addDays(new Date(), 1));
const openHours = [[9, 12]];

function goToTomorrow() {
  // If tomorrow is in the next month, move the calendar forward first.
  if (!isSameMonth(tomorrow, new Date())) {
    fireEvent.click(screen.getByLabelText("Next"));
  }
  const dayCells = screen
    .getAllByRole("gridcell")
    .filter((c) => !c.className.includes("disabled"));
  const cell = dayCells.find(
    (c) => c.querySelector(".number")?.textContent === format(tomorrow, "d")
  );
  if (!cell) throw new Error("tomorrow not rendered");
  fireEvent.click(cell);
}

describe("TimeCalendar", () => {
  it("renders the current month and hides the time toggle without openHours", () => {
    render(<TimeCalendar />);
    expect(screen.getByText(format(new Date(), "MMMM yyyy"))).toBeInTheDocument();
    expect(screen.queryByText("Select Time")).not.toBeInTheDocument();
  });

  it("calls onDateClick with the clicked day", () => {
    const onDateClick = vi.fn();
    render(<TimeCalendar onDateClick={onDateClick} openHours={openHours} />);
    goToTomorrow();
    expect(onDateClick).toHaveBeenCalledTimes(1);
    expect(isSameDay(onDateClick.mock.calls[0][0], tomorrow)).toBe(true);
  });

  it("still honours the deprecated onDateFunction prop", () => {
    const onDateFunction = vi.fn();
    render(<TimeCalendar onDateFunction={onDateFunction} openHours={openHours} />);
    goToTomorrow();
    expect(onDateFunction).toHaveBeenCalledTimes(1);
  });

  it("renders time slots from openHours and marks bookings disabled", () => {
    const onTimeClick = vi.fn();
    const bookings = [
      {
        id: 1,
        start_time: setHours(tomorrow, 10),
        end_time: setHours(tomorrow, 11),
      },
    ];
    render(
      <TimeCalendar
        openHours={openHours}
        timeSlot={30}
        bookings={bookings}
        onTimeClick={onTimeClick}
      />
    );
    goToTomorrow();
    fireEvent.click(screen.getByText("Select Time"));

    const slot = (label: string) => screen.getByText(label).closest(".cell")!;
    expect(slot("09:00")).not.toHaveClass("disabled");
    expect(slot("10:00")).toHaveClass("disabled");
    expect(slot("10:30")).toHaveClass("disabled");
    expect(slot("11:00")).not.toHaveClass("disabled");
    // 09:00–12:00 at 30 min = 6 slots, padded to 8; padding is disabled.
    expect(slot("12:00")).toHaveClass("disabled");

    fireEvent.click(slot("09:30"));
    expect(onTimeClick).toHaveBeenCalledTimes(1);
    expect(format(onTimeClick.mock.calls[0][0], "HH:mm")).toBe("09:30");
  });

  it("highlights the selected range and ignores a half-complete one", () => {
    const start = setMinutes(setHours(tomorrow, 9), 30);
    const end = setMinutes(setHours(tomorrow, 10), 30);
    const { rerender } = render(
      <TimeCalendar openHours={openHours} startTime={start} endTime="" />
    );
    goToTomorrow();
    fireEvent.click(screen.getByText("Select Time"));
    expect(screen.getByText("09:30").closest(".cell")).not.toHaveClass("selectedTime");

    rerender(<TimeCalendar openHours={openHours} startTime={start} endTime={end} />);
    expect(screen.getByText("09:30").closest(".cell")).toHaveClass("selectedTime");
    expect(screen.getByText("10:30").closest(".cell")).toHaveClass("selectedTime");
    expect(screen.getByText("11:00").closest(".cell")).not.toHaveClass("selectedTime");
  });

  it("does not throw when a day has no matching openHours entry", () => {
    render(<TimeCalendar openHours={[[9, 12], [10, 11], [9, 17]]} />);
    fireEvent.click(screen.getByText("Select Time"));
    expect(screen.getByText("Closed")).toBeInTheDocument();
  });

  it("does not select a cell on Tab keydown", () => {
    const onDateClick = vi.fn();
    render(<TimeCalendar onDateClick={onDateClick} />);
    const cell = screen.getAllByRole("gridcell").find((c) => !c.className.includes("disabled"))!;
    fireEvent.keyDown(cell, { key: "Tab" });
    expect(onDateClick).not.toHaveBeenCalled();
    fireEvent.keyDown(cell, { key: "Enter" });
    expect(onDateClick).toHaveBeenCalledTimes(1);
  });
});
