import { useMemo } from 'react'
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isToday,
} from 'date-fns'
import TaskChip from './TaskChip'
import type { Task } from '../../types/task.types'
import { taskOccursOnDate } from '../../utils/recurrence'


interface Props {
  currentDate: Date
  tasks: Task[]
  onSelectTask: (task: Task) => void
  onSelectDate: (date: Date) => void
  onDropTask: (taskId: string, newDate: Date) => void
}

export default function WeekView({
  currentDate,
  tasks,
  onSelectTask,
  onSelectDate,
  onDropTask,
}: Props) {
  const days = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 0 })
    const end   = endOfWeek(currentDate,   { weekStartsOn: 0 })
    return eachDayOfInterval({ start, end })
  }, [currentDate])

  const tasksForDay = (date: Date) =>
  tasks.filter(t => taskOccursOnDate(t, date).occurs)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.add('drag-over')
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('drag-over')
  }

  const handleDrop = (e: React.DragEvent, date: Date) => {
    e.currentTarget.classList.remove('drag-over')
    const taskId = e.dataTransfer.getData('taskId')
    if (taskId) onDropTask(taskId, date)
  }

  return (
    <div className="week-view">
      <div className="week-view-header">
        {days.map(day => (
          <div key={day.toISOString()} className="week-view-header-cell">
            <span className="week-header-day-name">{format(day, 'EEE')}</span>
            <div className={`week-header-day-number ${isToday(day) ? 'today' : ''}`}>
              {format(day, 'd')}
            </div>
          </div>
        ))}
      </div>

      <div className="week-view-body">
        {days.map(day => (
          <div
            key={day.toISOString()}
            className={`week-view-cell ${isToday(day) ? 'today' : ''}`}
            onClick={() => onSelectDate(day)}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={e => handleDrop(e, day)}
          >
            {tasksForDay(day).map(t => (
              <TaskChip
              key={t._id}
              task={t}
              onClick={onSelectTask}
              draggable={taskOccursOnDate(t, day).isAnchor}
            />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}