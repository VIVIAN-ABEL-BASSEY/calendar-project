import { useEffect, useRef } from 'react'
import { format } from 'date-fns'
import TaskChip from './TaskChip'
import type { Task } from '../../types/task.types'

interface Props {
  date: Date
  tasks: Task[]
  anchorRect: DOMRect
  onSelectTask: (task: Task) => void
  onClose: () => void
}

export default function DayPopover({
  date,
  tasks,
  anchorRect,
  onSelectTask,
  onClose,
}: Props) {
  const popoverRef = useRef<HTMLDivElement>(null)

  // position the popover near the cell that was clicked
  const top  = Math.min(anchorRect.bottom + 4, window.innerHeight - 240)
  const left = Math.min(anchorRect.left,       window.innerWidth  - 280)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <>
      {/* invisible overlay to catch outside clicks */}
      <div className="day-popover-overlay" onClick={onClose} />

      <div
        ref={popoverRef}
        className="day-popover"
        style={{ top, left }}
      >
        <div className="day-popover-header">
          <span className="day-popover-title">
            {format(date, 'MMM d')}
          </span>
          <button className="day-popover-close" onClick={onClose}>
            &#x2715;
          </button>
        </div>

        <div className="day-popover-tasks">
          {tasks.map(t => (
            <TaskChip
              key={t._id}
              task={t}
              onClick={(task) => {
                onClose()
                onSelectTask(task)
              }}
            />
          ))}
        </div>
      </div>
    </>
  )
}