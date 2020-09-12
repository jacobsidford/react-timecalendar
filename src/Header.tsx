//@ts-nocheck
import React from "react";
import { HeaderProps } from "./types";

function Header(props: HeaderProps) {
  const { prevTime, selectedDate, nextTime } = props;
  return (
    <div className="header row flex-middle">
      <div className="col col-start">
        <div
          className="icon"
          onClick={prevTime}
          onKeyDown={prevTime}
          tabIndex={0}
          role="button"
        >
          chevron_left
        </div>
      </div>
      <div className="col col-center">
        <span>{selectedDate}</span>
      </div>
      <div
        className="col col-end"
        onClick={nextTime}
        onKeyDown={nextTime}
        tabIndex="0"
        role="button"
      >
        <div className="icon">chevron_right</div>
      </div>
    </div>
  );
}

export default Header;
