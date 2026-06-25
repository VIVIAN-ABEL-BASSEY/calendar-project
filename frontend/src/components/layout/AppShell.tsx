import { useState, useCallback } from 'react'
import { format, addMonths, subMonths } from 'date-fns'
import TopBar from './TopBar'
import Sidebar from './Sidebar'
import type { Task } from '../../types/task.types'

interface AppShellProps {
  children: (
    currentDate: Date,
    registerCreateTask: (fn: () => void) => void,
    registerSelectTask: (fn: (task: Task) => void) => void
  ) => React.ReactNode
}

export default function AppShell({ children }: AppShellProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [createTaskFn, setCreateTaskFn] = useState<(() => void) | null>(null)
  const [selectTaskFn, setSelectTaskFn] = useState<((task: Task) => void) | null>(null)

  const handlePrev  = () => setCurrentDate(d => subMonths(d, 1))
  const handleNext  = () => setCurrentDate(d => addMonths(d, 1))
  const handleToday = () => setCurrentDate(new Date())

  const handleMiniCalendarSelect = (date: Date) => {
    setCurrentDate(date)
  }

  const registerCreateTask = useCallback((fn: () => void) => {
    setCreateTaskFn(() => fn)
  }, [])

  const registerSelectTask = useCallback((fn: (task: Task) => void) => {
    setSelectTaskFn(() => fn)
  }, [])

  const monthLabel = format(currentDate, 'MMMM yyyy')

  return (
    <div className="app-shell">
      <TopBar
        monthLabel={monthLabel}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={handleToday}
        onSelectTask={(task) => selectTaskFn?.(task)}
      />
      <div className="shell-body">
        <Sidebar
          currentDate={currentDate}
          onCreateTask={() => createTaskFn?.()}
          onSelectDate={handleMiniCalendarSelect}
        />
        <main className="main-content">
          {children(currentDate, registerCreateTask, registerSelectTask)}
        </main>
      </div>
    </div>
  )
}