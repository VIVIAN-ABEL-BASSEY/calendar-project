import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { loadTasks } from '../features/tasks/tasksSlice'
import { setSelectedDate } from '../features/calendar/calendarSlice'
import CalendarGrid from '../components/calendar/CalendarGrid'
import type { Task } from '../types/task.types'
import '../styles/calendar.css'

interface Props {
  currentDate: Date
}

export default function CalendarPage({ currentDate }: Props) {
  const dispatch = useAppDispatch()
  const { items: tasks, isLoading, error } = useAppSelector(s => s.tasks)

  // load tasks once when the page mounts
  useEffect(() => {
    dispatch(loadTasks())
  }, [dispatch])

  const handleSelectDate = (date: Date) => {
    dispatch(setSelectedDate(date.toISOString()))
  }

  const handleSelectTask = (task: Task) => {
    console.log('task clicked', task)
    // we'll open a modal here in the next step
  }

  if (isLoading) {
    return (
      <div style={{ padding: 32, color: 'var(--color-text-muted)' }}>
        Loading tasks...
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: 32, color: 'var(--color-error)' }}>
        {error}
      </div>
    )
  }

  return (
    <CalendarGrid
      currentDate={currentDate}
      tasks={tasks}
      onSelectTask={handleSelectTask}
      onSelectDate={handleSelectDate}
    />
  )
}