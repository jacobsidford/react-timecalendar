import React from "react";
import { HeaderProps } from "./types";
import { onActivate } from "./keyboard";

function Header(props: HeaderProps) {
  const { prevTime, selectedDate, nextTime } = props;
  return (
    <div className="header row flex-middle">
      <div className="col col-start">
        <div
          className="icon"
          onClick={prevTime}
          onKeyDown={onActivate(prevTime)}
          tabIndex={0}
          role="button"
          aria-label="Previous"
        >
          chevron_left
        </div>
      </div>
      <div className="col col-center">
        <span>{selectedDate}</span>
      </div>
      <div className="col col-end">
        <div
          className="icon"
          onClick={nextTime}
          onKeyDown={onActivate(nextTime)}
          tabIndex={0}
          role="button"
          aria-label="Next"
        >
          chevron_right
        </div>
      </div>
    </div>
  );
}

export default Header;
