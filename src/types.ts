export type DateInput = Date | string | number;

export type Booking = {
  id: string | number;
  start_time: DateInput;
  end_time: DateInput;
};

export type SelectedTime = {
  start: DateInput | "";
  end: DateInput | "";
};

export interface DayProps {
  classSet: string;
  date: string;
  onDateClick: () => void;
}

export interface DayTitleProps {
  currentMonth: Date;
}

export interface HeaderProps {
  selectedDate: string;
  prevTime: () => void;
  nextTime: () => void;
}

export type CalendarView = "month" | "day";

export interface TimeCalendarProps {
  /**
   * Controlled: the day the calendar is focused on (month shown in month
   * view, day shown in day view). Pair with onSelectedDateChange.
   */
  selectedDate?: Date;
  /** Uncontrolled: initial selected day. Defaults to today. */
  defaultSelectedDate?: Date;
  /** Fires whenever the selected day changes: day click, or prev/next navigation. */
  onSelectedDateChange?: (day: Date) => void;
  /** Controlled: which view is shown. Pair with onViewChange. */
  view?: CalendarView;
  /** Uncontrolled: initial view. Defaults to "month". */
  defaultView?: CalendarView;
  /** Fires when the user toggles between month and day view. */
  onViewChange?: (view: CalendarView) => void;
  /** Opening hours as [open, close] pairs in 24h decimal. 1, 2 or 7 entries. */
  openHours?: number[][];
  /** Existing bookings; slots inside them render as disabled. */
  bookings?: Booking[];
  /** Block navigation to past months/days and disable past dates/times. */
  disableHistory?: boolean;
  /** Make days and time slots clickable. */
  clickable?: boolean;
  /** Length of each time slot in minutes. */
  timeSlot?: number;
  /** Called with the Date of the clicked day. */
  onDateClick?: (day: Date) => void;
  /** @deprecated use onDateClick */
  onDateFunction?: (day: Date) => void;
  /** Called with the Date of the clicked time slot. */
  onTimeClick?: (time: Date) => void;
  /** Multi-select: first selected time. */
  startTime?: DateInput | "";
  /** Multi-select: second selected time, must be after startTime. */
  endTime?: DateInput | "";
}

export interface TimeSelectProps {
  disableHistory: boolean;
  selectedDate: Date;
  timeSlot: number;
  openHours: number[][];
  onTimeClick: (time: Date) => void;
  bookings: Booking[];
  selectedTime: SelectedTime;
}

export interface TimeSlotProps {
  classSet: string;
  time: string;
  onTimeClick: () => void;
}

export interface WeeksProps {
  selectedDate: Date;
  bookings: Booking[];
  timeSlot: number;
  onDateClick: (day: Date) => void;
  clickable: boolean;
  disableHistory: boolean;
  selectedTime: SelectedTime;
}
