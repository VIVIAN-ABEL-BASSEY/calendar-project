import { useState } from 'react'
import { useAppSelector } from '../../app/hooks'
import { getGroupColor } from '../../utils/groupColors'
import { extractGroupId } from '../../utils/groupHelpers'
import MiniCalendar from './MiniCalendar'
import GroupModal from '../tasks/GroupModal'

interface SidebarProps {
  currentDate: Date
  onCreateTask: () => void
  onSelectDate: (date: Date) => void
}

export default function Sidebar({ currentDate, onCreateTask, onSelectDate }: SidebarProps) {
  const groups = useAppSelector(s => s.groups.items)
  const tasks  = useAppSelector(s => s.tasks.items)
  const [groupModalOpen, setGroupModalOpen] = useState(false)

  // count tasks per group
  const taskCountByGroup = (groupId: string) =>
    tasks.filter(t => extractGroupId(t.groupId) === groupId).length

  return (
    <div className="sidebar">
      <button className="sidebar-create-btn" onClick={onCreateTask}>
        <span style={{ fontSize: 22, lineHeight: 1, color: 'var(--color-primary)' }}>+</span>
        Create task
      </button>

      <MiniCalendar
        currentDate={currentDate}
        onSelectDate={onSelectDate}
      />

      <div>
        <div className="sidebar-section-header">
          <span className="sidebar-section-title">My calendars</span>
          <button
            className="sidebar-section-add"
            onClick={() => setGroupModalOpen(true)}
            title="Add calendar"
          >
            +
          </button>
        </div>

        {groups.length === 0 ? (
          <div className="sidebar-empty">
            No calendars yet.{' '}
            <button
              style={{ color: 'var(--color-primary)', fontSize: 12 }}
              onClick={() => setGroupModalOpen(true)}
            >
              Create one
            </button>
          </div>
        ) : (
          groups.map(g => {
            const count = taskCountByGroup(g._id)
            return (
              <button key={g._id} className="sidebar-group-item">
                <span
                  className="sidebar-group-dot"
                  style={{ background: getGroupColor(g._id) }}
                />
                <span style={{ flex: 1, textAlign: 'left' }}>{g.name}</span>
                {count > 0 && (
                  <span className="sidebar-group-count">{count}</span>
                )}
              </button>
            )
          })
        )}
      </div>

      {groupModalOpen && (
        <GroupModal onClose={() => setGroupModalOpen(false)} />
      )}
    </div>
  )
}