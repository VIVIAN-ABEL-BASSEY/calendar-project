import { isSameDay } from 'date-fns'
import TaskChip from './TaskChip'
import type { CalendarDay } from '../../utils/dateHelpers'
import type { Task } from '../../types/task.types'

interface Props {
  day: CalendarDay
  tasks: Task[]
  selectedDate: Date | null
  onSelectDate: (date: Date) => void
  onSelectTask: (task: Task) => void
}

export default function CalendarCell({
  day,
  tasks,
  selectedDate,
  onSelectDate,
  onSelectTask
}: Props) {
  const isSelected = selectedDate
    ? isSameDay(selectedDate, day.date)
    : false

  const classes = [
    'calendar-cell',
    !day.isCurrentMonth ? 'other-month' : '',
    day.isToday        ? 'today'       : '',
    isSelected         ? 'selected'    : '',
  ].filter(Boolean).join(' ')

  return (
    <div className={classes} onClick={() => onSelectDate(day.date)}>
      <span className="cell-date-number">{day.dayNumber}</span>
      <div className="cell-tasks">
        {tasks.slice(0, 3).map(t => (
          <TaskChip key={t._id} task={t} onClick={onSelectTask} />
        ))}
        {tasks.length > 3 && (
          <span className="more-tasks">+{tasks.length - 3} more</span>
        )}
      </div>
    </div>
  )
}