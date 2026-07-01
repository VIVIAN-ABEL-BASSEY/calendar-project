import { format, isToday, isSameDay } from 'date-fns'
import { useAppSelector } from '../../app/hooks'
import { getGroupColor } from '../../utils/groupColors'
import { extractGroupId } from '../../utils/groupHelpers'
import type { Task } from '../../types/task.types'
import { taskOccursOnDate } from '../../utils/recurrence'

interface Props {
  currentDate: Date
  tasks: Task[]
  onSelectTask: (task: Task) => void
  onSelectDate: (date: Date) => void
  onDropTask: (taskId: string, newDate: Date) => void
}

const PRIORITY_COLORS: Record<string, string> = {
  high:   '#d93025',
  medium: '#f9ab00',
  low:    '#1e8e3e',
}

export default function DayView({
  currentDate,
  tasks,
  onSelectTask,
  onSelectDate,
  onDropTask,
}: Props) {
  const groups = useAppSelector(s => s.groups.items)

  const dayTasks = tasks.filter(t => taskOccursOnDate(t, currentDate).occurs)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.add('drag-over')
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('drag-over')
  }

  const handleDrop = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('drag-over')
    const taskId = e.dataTransfer.getData('taskId')
    if (taskId) onDropTask(taskId, currentDate)
  }

  const today = isToday(currentDate)

  return (
    <div className="day-view">
      <div className="day-view-header">
        <div className="day-view-title">
          {today
            ? <><span>{format(currentDate, 'd')}</span> {format(currentDate, 'MMMM yyyy')}</>
            : format(currentDate, 'd MMMM yyyy')
          }
        </div>
      </div>

      <div
        className="day-view-body day-view-drop-zone"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => onSelectDate(currentDate)}
      >
        {dayTasks.length === 0 ? (
          <div className="day-view-empty">
            No tasks for this day. Click anywhere to create one.
          </div>
        ) : (
          dayTasks.map(task => {
            const groupId = extractGroupId(task.groupId)
            const group   = groups.find(g => g._id === groupId)
            const color   = group ? getGroupColor(group._id) : '#9aa0a6'

            return (
              <div
                key={task._id}
                className="day-view-task-row"
                onClick={e => { e.stopPropagation(); onSelectTask(task) }}
                style={{ borderLeft: `4px solid ${color}` }}
              >
                <div className="day-view-task-title">{task.title}</div>
                <div className="day-view-task-meta">
                  <span style={{ color: PRIORITY_COLORS[task.priority] }}>
                    {task.priority}
                  </span>
                  <span>{task.status}</span>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}