import { useState, useMemo } from 'react'
import {
  format,
  addMonths,
  subMonths,
  isSameDay,
  isToday,
  isSameMonth,
} from 'date-fns'
import { buildCalendarGrid, WEEK_HEADERS } from '../../utils/dateHelpers'
import { useAppSelector } from '../../app/hooks'

interface Props {
  // the date the main calendar is currently showing
  currentDate: Date
  // called when user clicks a day — jumps the main calendar to that month
  onSelectDate: (date: Date) => void
}

export default function MiniCalendar({ currentDate, onSelectDate }: Props) {
  // mini calendar has its own independent month state
  const [miniDate, setMiniDate] = useState(new Date())

  const tasks = useAppSelector(s => s.tasks.items)

  const weeks = useMemo(
    () => buildCalendarGrid(miniDate),
    [miniDate]
  )

  // build a set of date strings that have tasks for quick lookup
  const datesWithTasks = useMemo(() => {
    const set = new Set<string>()
    tasks.forEach(t => {
      if (t.dueDate) {
        set.add(format(new Date(t.dueDate), 'yyyy-MM-dd'))
      }
    })
    return set
  }, [tasks])

  const handleDayClick = (date: Date) => {
    onSelectDate(date)
    // also sync the mini calendar to show the clicked month
    setMiniDate(date)
  }

  return (
    <div className="mini-calendar">
      <div className="mini-calendar-header">
        <span className="mini-calendar-title">
          {format(miniDate, 'MMM yyyy')}
        </span>
        <div style={{ display: 'flex', gap: 2 }}>
          <button
            className="mini-calendar-nav"
            onClick={() => setMiniDate(d => subMonths(d, 1))}
          >
            &#8249;
          </button>
          <button
            className="mini-calendar-nav"
            onClick={() => setMiniDate(d => addMonths(d, 1))}
          >
            &#8250;
          </button>
        </div>
      </div>

      <div className="mini-calendar-weekdays">
        {WEEK_HEADERS.map(d => (
          <div key={d} className="mini-calendar-weekday">
            {d[0]} {/* just the first letter — S M T W T F S */}
          </div>
        ))}
      </div>

      <div className="mini-calendar-grid">
        {weeks.map((week, wi) => (
          <div key={wi} className="mini-calendar-week">
            {week.map(day => {
              const dateKey = format(day.date, 'yyyy-MM-dd')
              const hasTasks = datesWithTasks.has(dateKey)

              const classes = [
                'mini-calendar-day',
                !day.isCurrentMonth              ? 'other-month' : '',
                isToday(day.date)                ? 'today'       : '',
                isSameDay(day.date, currentDate) ? 'selected'    : '',
                hasTasks                         ? 'has-tasks'   : '',
              ].filter(Boolean).join(' ')

              return (
                <button
                  key={day.date.toISOString()}
                  className={classes}
                  onClick={() => handleDayClick(day.date)}
                >
                  {day.dayNumber}
                </button>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}