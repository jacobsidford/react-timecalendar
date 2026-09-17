import React from "react";
import { TimeSlotProps } from "./types";
import { onActivate } from "./keyboard";

function TimeSlot(props: TimeSlotProps) {
  const { classSet, onTimeClick, time } = props;
  return (
    <div
      className={`col cell${classSet}`}
      onClick={onTimeClick}
      onKeyDown={onActivate(onTimeClick)}
      role="button"
      tabIndex={0}
    >
      <p>{time}</p>
    </div>
  );
}

export default TimeSlot;
