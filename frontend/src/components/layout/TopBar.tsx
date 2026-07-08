import { useState, useRef, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { logout } from '../../features/auth/authSlice'
import { setView } from '../../features/calendar/calendarSlice'
import type { CalendarView } from '../../features/calendar/calendarSlice'
import { useNavigate } from 'react-router-dom'
import TaskSearch from './TaskSearch'
import { useDarkMode } from '../../hooks/useDarkMode'
import type { Task } from '../../types/task.types'

interface TopBarProps {
  monthLabel: string
  onPrev:  () => void
  onNext:  () => void
  onToday: () => void
  onSelectTask: (task: Task) => void
}

export default function TopBar({ monthLabel, onPrev, onNext, onToday, onSelectTask }: TopBarProps) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { isDark, toggleDarkMode } = useDarkMode()
  const user = useAppSelector(s => s.auth.user)
  const currentView = useAppSelector(s => s.calendar.view)

  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const initials = user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : '?'
  const fullName = user ? `${user.firstName} ${user.lastName}` : ''

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const handleViewChange = (view: CalendarView) => {
    dispatch(setView(view))
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="topbar">
      <span className="topbar-logo">Task Myr</span>

      <button className="topbar-today-btn" onClick={onToday}>Today</button>
      <button className="topbar-nav-btn" onClick={onPrev}>&#8249;</button>
      <button className="topbar-nav-btn" onClick={onNext}>&#8250;</button>

      <span className="topbar-month-label">{monthLabel}</span>

      <div className="view-toggle">
        {(['month', 'week', 'day'] as CalendarView[]).map(v => (
          <button
            key={v}
            className={`view-toggle-btn ${currentView === v ? 'active' : ''}`}
            onClick={() => handleViewChange(v)}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>
      <button
        className="topbar-theme-btn"
        onClick={toggleDarkMode}
        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDark ? '☀️' : '🌙'}
      </button>
      <TaskSearch onSelectTask={onSelectTask} />

      <div className="topbar-user" ref={dropdownRef}>
        <div className="topbar-avatar" onClick={() => setDropdownOpen(d => !d)} title={fullName}>
          {initials}
        </div>

        {dropdownOpen && (
          <div className="topbar-dropdown">
            <div className="topbar-dropdown-header">
              <div className="topbar-dropdown-avatar">{initials}</div>
              <div className="topbar-dropdown-info">
                <span className="topbar-dropdown-name">{fullName}</span>
                <span className="topbar-dropdown-email">{user?.email}</span>
              </div>
            </div>
            <div className="topbar-dropdown-divider" />
            <button className="topbar-dropdown-item" onClick={handleLogout}>
              Sign out
            </button>
          </div>
        )}
      </div>
    </div>
  )
}