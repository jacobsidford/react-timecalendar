export type Booking = {
  id: string;
  start_time: Date;
  end_time: Date;
};

export type SelectedTime = {
  startTime: string;
  endTime: string;
};

export interface DayProps {
  classSet: string;
  date: string;
  onDateClick: Function;
}

export interface DayTitleProps {
  currentMonth: Date;
}

export interface HeaderProps {
  selectedDate: string;
  prevTime: Function;
  nextTime: Function;
}

export interface TimeCalendarProps {
  openHours: number[][];
  bookings: Booking[];
  disableHistory: boolean;
  clickable: boolean;
  timeSlot: number;
  onDateFunction: Function;
  onTimeClick: Function;
  startTime: SelectedTime["startTime"];
  endTime: SelectedTime["endTime"];
}

export interface TimeSelectProps {
  disableHistory: boolean;
  selectedDate: Date;
  timeSlot: number;
  openHours: number[][];
  onTimeClick: Function;
  bookings: Booking[];
  startTime: SelectedTime["startTime"];
  endTime: SelectedTime["endTime"];
}

export interface TimeSlotProps {
  classSet: string;
  time: string;
  onTimeClick: Function;
}

export interface WeeksProps {
  selectedDate: Date;
  bookings: Booking[];
  timeSlot: number;
  onDateClick: Function;
  clickable: boolean;
  disableHistory: boolean;
  startTime: SelectedTime["startTime"];
  endTime: SelectedTime["endTime"];
}
