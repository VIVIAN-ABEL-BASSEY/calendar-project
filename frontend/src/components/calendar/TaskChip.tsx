import type { Task } from '../../types/task.types'

interface Props {
  task: Task
  onClick: (task: Task) => void
}

export default function TaskChip({ task, onClick }: Props) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation() // prevent the cell click from firing too
    onClick(task)
  }

  return (
    <div
      className={`task-chip ${task.status}`}
      onClick={handleClick}
      title={task.title}
    >
      {task.title}
    </div>
  )
}