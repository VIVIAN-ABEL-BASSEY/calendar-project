import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isToday
} from 'date-fns'

export interface CalendarDay {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
  dayNumber: string
}

export const WEEK_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function buildCalendarGrid(monthDate: Date): CalendarDay[][] {
  const monthStart = startOfMonth(monthDate)
  const monthEnd   = endOfMonth(monthDate)

  // grid always starts on Sunday and ends on Saturday
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 })
  const gridEnd   = endOfWeek(monthEnd,     { weekStartsOn: 0 })

  const allDays = eachDayOfInterval({ start: gridStart, end: gridEnd })

  // chunk into rows of 7
  const weeks: CalendarDay[][] = []
  for (let i = 0; i < allDays.length; i += 7) {
    weeks.push(
      allDays.slice(i, i + 7).map(date => ({
        date,
        isCurrentMonth: isSameMonth(date, monthDate),
        isToday: isToday(date),
        dayNumber: format(date, 'd'),
      }))
    )
  }

  return weeks
}