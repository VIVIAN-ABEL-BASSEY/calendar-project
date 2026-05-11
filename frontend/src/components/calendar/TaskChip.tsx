import type { Task } from '../../types/task.types'

interface Props {
  task: Task
  onClick: (task: Task) => void
}

const PRIORITY_COLORS: Record<string, string> = {
  high:   '#d93025',
  medium: '#f9ab00',
  low:    '#1e8e3e',
}

export default function TaskChip({ task, onClick }: Props) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onClick(task)
  }

  return (
    <div
      className={`task-chip ${task.status}`}
      onClick={handleClick}
      title={`${task.title} — ${task.priority} priority`}
    >
      <span
        className="task-chip-dot"
        style={{ background: PRIORITY_COLORS[task.priority] ?? '#9aa0a6' }}
      />
      <span className="task-chip-title">{task.title}</span>
    </div>
  )
}