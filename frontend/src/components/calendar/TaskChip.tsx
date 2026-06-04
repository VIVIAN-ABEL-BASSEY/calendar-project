import { useAppSelector } from '../../app/hooks'
import { getGroupColor } from '../../utils/groupColors'
import { extractGroupId } from '../../utils/groupHelpers'
import type { Task } from '../../types/task.types'

interface Props {
  task: Task
  onClick: (task: Task) => void
  draggable?: boolean
}

const PRIORITY_COLORS: Record<string, string> = {
  high:   '#d93025',
  medium: '#f9ab00',
  low:    '#1e8e3e',
}

export default function TaskChip({ task, onClick, draggable = false }: Props) {
  const groups = useAppSelector(s => s.groups.items)

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onClick(task)
  }

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('taskId', task._id)
    e.dataTransfer.effectAllowed = 'move'
  }

  const groupId = extractGroupId(task.groupId)
  const group   = groups.find(g => g._id === groupId)
  const chipColor = group ? getGroupColor(group._id) : '#9aa0a6'

  return (
    <div
      className={`task-chip ${task.status}`}
      onClick={handleClick}
      draggable={draggable}
      onDragStart={draggable ? handleDragStart : undefined}
      title={`${task.title} — ${task.priority} priority${group ? ` — ${group.name}` : ''}`}
      style={{ borderLeft: `3px solid ${chipColor}`, paddingLeft: 5 }}
    >
      <span
        className="task-chip-dot"
        style={{ background: PRIORITY_COLORS[task.priority] ?? '#9aa0a6' }}
      />
      <span className="task-chip-title">{task.title}</span>
    </div>
  )
}