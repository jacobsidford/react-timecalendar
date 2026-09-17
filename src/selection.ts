import { isValid, isWithinInterval } from "date-fns";
import { SelectedTime } from "./types";
import { toDateValue } from "./dates";

/**
 * True when `time` falls inside the multi-select range. An empty or
 * half-complete range never matches. isWithinInterval throws when
 * start > end, so guard that rather than letting a bad prop crash the render.
 */
export function isWithinSelection(time: Date, selected: SelectedTime): boolean {
  if (selected.start === "" || selected.end === "") return false;
  const start = toDateValue(selected.start);
  const end = toDateValue(selected.end);
  if (!isValid(start) || !isValid(end) || start > end) {
    return false;
  }
  return isWithinInterval(time, { start, end });
}
