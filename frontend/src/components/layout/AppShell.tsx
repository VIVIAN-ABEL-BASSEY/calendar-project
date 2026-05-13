import { useState, useCallback } from 'react'
import { format, addMonths, subMonths } from 'date-fns'
import TopBar from './TopBar'
import Sidebar from './Sidebar'

interface AppShellProps {
  children: (
    currentDate: Date,
    registerCreateTask: (fn: () => void) => void
  ) => React.ReactNode
}

export default function AppShell({ children }: AppShellProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [createTaskFn, setCreateTaskFn] = useState<(() => void) | null>(null)

  const handlePrev  = () => setCurrentDate(d => subMonths(d, 1))
  const handleNext  = () => setCurrentDate(d => addMonths(d, 1))
  const handleToday = () => setCurrentDate(new Date())

  // when user clicks a day in the mini calendar
  // jump the main calendar to that month
  const handleMiniCalendarSelect = (date: Date) => {
    setCurrentDate(date)
  }

  const registerCreateTask = useCallback((fn: () => void) => {
    setCreateTaskFn(() => fn)
  }, [])

  const monthLabel = format(currentDate, 'MMMM yyyy')

  return (
    <div className="app-shell">
      <TopBar
        monthLabel={monthLabel}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={handleToday}
      />
      <div className="shell-body">
        <Sidebar
          currentDate={currentDate}
          onCreateTask={() => createTaskFn?.()}
          onSelectDate={handleMiniCalendarSelect}
        />
        <main className="main-content">
          {children(currentDate, registerCreateTask)}
        </main>
      </div>
    </div>
  )
}