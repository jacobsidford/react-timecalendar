import { isValid, parseISO, toDate } from "date-fns";
import { DateInput } from "./types";

/** Normalise the loose DateInput type to a Date. Strings go through ISO parsing first. */
export function toDateValue(input: DateInput): Date {
  if (input instanceof Date) return input;
  if (typeof input === "number") return toDate(input);
  const iso = parseISO(input);
  return isValid(iso) ? iso : new Date(input);
}
