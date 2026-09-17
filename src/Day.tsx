import React from "react";
import { DayProps } from "./types";
import { onActivate } from "./keyboard";

function Day(props: DayProps) {
  const { classSet, onDateClick, date } = props;
  return (
    <div
      className={`col cell${classSet}`}
      role="gridcell"
      tabIndex={0}
      onClick={onDateClick}
      onKeyDown={onActivate(onDateClick)}
    >
      <span className="number">{date}</span>
      <span className="bg">{date}</span>
    </div>
  );
}

export default Day;
