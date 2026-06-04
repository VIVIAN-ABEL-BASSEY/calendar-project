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
  onDropTask: (taskId: string, newDate: Date) => void
}

export default function CalendarCell({
  day,
  tasks,
  selectedDate,
  onSelectDate,
  onSelectTask,
  onDropTask,
}: Props) {
  const [popoverAnchor, setPopoverAnchor] = useState<DOMRect | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const isSelected = selectedDate
    ? isSameDay(selectedDate, day.date)
    : false

  const classes = [
    'calendar-cell',
    !day.isCurrentMonth ? 'other-month' : '',
    day.isToday         ? 'today'       : '',
    isSelected          ? 'selected'    : '',
    isDragOver          ? 'drag-over'   : '',
  ].filter(Boolean).join(' ')

  const handleMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setPopoverAnchor(e.currentTarget.getBoundingClientRect())
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => setIsDragOver(false)

  const handleDrop = (e: React.DragEvent) => {
    setIsDragOver(false)
    const taskId = e.dataTransfer.getData('taskId')
    if (taskId) onDropTask(taskId, day.date)
  }

  return (
    <>
      <div
        className={classes}
        onClick={() => onSelectDate(day.date)}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="cell-header">
          <span className="cell-date-number">{day.dayNumber}</span>
          <span className="cell-add-hint">+</span>
        </div>
        <div className="cell-tasks">
          {tasks.slice(0, 3).map(t => (
            <TaskChip
              key={t._id}
              task={t}
              onClick={onSelectTask}
              draggable
            />
          ))}
          {tasks.length > 3 && (
            <span className="more-tasks" onClick={handleMoreClick}>
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