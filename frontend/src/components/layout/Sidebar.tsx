// group colors — we'll pull these from the store later when groups are real
const DEFAULT_GROUPS = [
  { id: '1', name: 'My Tasks',     color: '#4285f4' },
  { id: '2', name: 'Dev Bucket',   color: '#0f9d58' },
  { id: '3', name: 'Personal Dev', color: '#f4b400' },
  { id: '4', name: 'Career Plans', color: '#db4437' },
]

interface SidebarProps {
  onCreateTask: () => void
}

export default function Sidebar({ onCreateTask }: SidebarProps) {
  return (
    <div className="sidebar">
      <button className="sidebar-create-btn" onClick={onCreateTask}>
        <span style={{ fontSize: 22, lineHeight: 1, color: 'var(--color-primary)' }}>+</span>
        Create task
      </button>

      <div>
        <div className="sidebar-section-title">My calendars</div>
        {DEFAULT_GROUPS.map(g => (
          <button key={g.id} className="sidebar-group-item">
            <span
              className="sidebar-group-dot"
              style={{ background: g.color }}
            />
            {g.name}
          </button>
        ))}
      </div>
    </div>
  )
}