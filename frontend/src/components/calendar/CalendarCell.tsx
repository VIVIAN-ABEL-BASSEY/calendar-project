import { useState } from 'react'
import { isSameDay } from 'date-fns'
import TaskChip from './TaskChip'
import DayPopover from './DayPopover'
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
  onSelectTask,
}: Props) {
  const [popoverAnchor, setPopoverAnchor] = useState<DOMRect | null>(null)

  const isSelected = selectedDate
    ? isSameDay(selectedDate, day.date)
    : false

  const classes = [
    'calendar-cell',
    !day.isCurrentMonth ? 'other-month' : '',
    day.isToday         ? 'today'       : '',
    isSelected          ? 'selected'    : '',
  ].filter(Boolean).join(' ')

  const handleMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation() // don't open the create modal
    setPopoverAnchor(e.currentTarget.getBoundingClientRect())
  }

  return (
    <>
      <div className={classes} onClick={() => onSelectDate(day.date)}>
        <div className="cell-header">
          <span className="cell-date-number">{day.dayNumber}</span>
          <span className="cell-add-hint">+</span>
        </div>
        <div className="cell-tasks">
          {tasks.slice(0, 3).map(t => (
            <TaskChip key={t._id} task={t} onClick={onSelectTask} />
          ))}
          {tasks.length > 3 && (
            <span
              className="more-tasks"
              onClick={handleMoreClick}
            >
              +{tasks.length - 3} more
            </span>
          )}
        </div>
      </div>

      {popoverAnchor && (
        <DayPopover
          date={day.date}
          tasks={tasks}
          anchorRect={popoverAnchor}
          onSelectTask={onSelectTask}
          onClose={() => setPopoverAnchor(null)}
        />
      )}
    </>
  )
}