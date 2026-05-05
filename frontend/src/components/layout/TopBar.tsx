import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { logout } from '../../features/auth/authSlice'
import { useNavigate } from 'react-router-dom'

interface TopBarProps {
  monthLabel: string
  onPrev: () => void
  onNext: () => void
  onToday: () => void
}

export default function TopBar({ monthLabel, onPrev, onNext, onToday }: TopBarProps) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector(s => s.auth.user)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  // get initials for avatar — e.g. "Vivian Hogan-Bassey" → "VH"
  const initials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : '?'

  return (
    <div className="topbar">
      <span className="topbar-logo">Task Myr</span>

      <button className="topbar-today-btn" onClick={onToday}>
        Today
      </button>

      <button className="topbar-nav-btn" onClick={onPrev}>&#8249;</button>
      <button className="topbar-nav-btn" onClick={onNext}>&#8250;</button>

      <span className="topbar-month-label">{monthLabel}</span>

      <div className="topbar-user">
        <div className="topbar-avatar" title={user?.firstName}>
          {initials}
        </div>
        <button className="topbar-logout-btn" onClick={handleLogout}>
          Sign out
        </button>
      </div>
    </div>
  )
}