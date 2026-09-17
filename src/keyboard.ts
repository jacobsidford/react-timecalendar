import React from "react";

/** Only trigger click-like handlers on Enter/Space so Tab navigation doesn't select cells. */
export function onActivate(handler: () => void) {
  return (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handler();
    }
  };
}
