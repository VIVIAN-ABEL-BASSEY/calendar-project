// src/components/calendar/CalendarGrid.tsx
import { useMemo, useState } from 'react'
import { buildCalendarGrid, WEEK_HEADERS } from '../../utils/dateHelpers'
import { isSameDay } from 'date-fns'
import CalendarCell from './CalendarCell'
import type { Task } from '../../types/task.types'

interface Props {
  currentDate: Date
  tasks: Task[]
  onSelectTask: (task: Task) => void
  onSelectDate: (date: Date) => void
}

export default function CalendarGrid({
  currentDate,
  tasks,
  onSelectTask,
  onSelectDate,
}: Props) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const weeks = useMemo(
    () => buildCalendarGrid(currentDate),
    [currentDate]
  )

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date)
    onSelectDate(date)
  }

  // filter tasks that belong to a specific day
  const tasksForDay = (date: Date) =>
    tasks.filter(t => t.dueDate && isSameDay(new Date(t.dueDate), date))

  return (
    <div className="calendar-container">
      <div className="calendar-week-header">
        {WEEK_HEADERS.map(day => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div className="calendar-body">
        {weeks.map((week, wi) => (
          <div key={wi} className="calendar-week-row">
            {week.map(day => (
              <CalendarCell
                key={day.date.toISOString()}
                day={day}
                tasks={tasksForDay(day.date)}
                selectedDate={selectedDate}
                onSelectDate={handleSelectDate}
                onSelectTask={onSelectTask}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}