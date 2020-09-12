export interface TestComponentProps {
    theme: "primary" | "secondary";
  }

  export interface DayProps {
    classSet: string,
    date: string,
    onDateClick: Function,
  }

  export interface DayTitleProps {
    currentMonth: Date,
  }

  export interface HeaderProps {
    selectedDate: string,
    prevTime: Function,
    nextTime: Function,
  }

  export interface TimeCalendarProps {
    openHours: number[][],
    bookings: string[],
    disableHistory: boolean,
    clickable: boolean,
    timeSlot: number,
    onDateFunction: Function,
    onTimeClick: Function,
    startTime: string,
    endTime: string
  }

  export interface TimeSelectProps {

  }

  export interface TimeSlotProps {

  }

  export interface WeeksProps {

  }