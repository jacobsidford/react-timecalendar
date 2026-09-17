import dateFns from "date-fns";
import { SelectedTime } from "./types";

/**
 * True when `time` falls inside the multi-select range. An empty or
 * half-complete range never matches. date-fns v1 throws when start > end,
 * so guard that rather than letting a bad prop crash the render.
 */
export function isWithinSelection(time: Date, selected: SelectedTime): boolean {
  if (selected.start === "" || selected.end === "") return false;
  const start = dateFns.parse(selected.start);
  const end = dateFns.parse(selected.end);
  if (!dateFns.isValid(start) || !dateFns.isValid(end) || start > end) {
    return false;
  }
  return dateFns.isWithinRange(time, start, end);
}
