import { format } from 'date-fns'
import type { Task } from '../../types/task.types'

interface Props {
  tasks: Task[]
  groupName: string
  onSelectTask: (task: Task) => void
  onClose: () => void
}

const PRIORITY_COLORS: Record<string, string> = {
  high:   '#d93025',
  medium: '#f9ab00',
  low:    '#1e8e3e',
}

export default function GroupTaskList({ tasks, groupName, onSelectTask, onClose }: Props) {
  const sorted = [...tasks].sort((a, b) => {
    if (!a.dueDate && !b.dueDate) return 0
    if (!a.dueDate) return 1
    if (!b.dueDate) return -1
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  })

  return (
    <div className="group-task-list">
      <div className="group-task-list-header">
        <span className="group-task-list-title">{groupName}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span className="group-task-list-count">
            {tasks.length} task{tasks.length !== 1 ? 's' : ''}
          </span>
          <button className="group-task-list-close" onClick={onClose}>
            &#x2715;
          </button>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="group-task-list-empty">
          No tasks in this calendar yet.
        </div>
      ) : (
        <div className="group-task-list-body">
          {sorted.map(task => (
            <div
              key={task._id}
              className="group-task-list-row"
              onClick={() => onSelectTask(task)}
            >
              <span
                className="group-task-list-dot"
                style={{ background: PRIORITY_COLORS[task.priority] ?? '#9aa0a6' }}
              />
              <span className="group-task-list-row-title">{task.title}</span>
              <span className={`group-task-list-status status-${task.status}`}>
                {task.status}
              </span>
              <span className="group-task-list-row-date">
                {task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : 'No date'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}