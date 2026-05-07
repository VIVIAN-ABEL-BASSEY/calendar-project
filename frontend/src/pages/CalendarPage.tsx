import { useEffect, useState, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { loadTasks } from '../features/tasks/tasksSlice'
import { setSelectedDate } from '../features/calendar/calendarSlice'
import CalendarGrid from '../components/calendar/CalendarGrid'
import TaskModal from '../components/tasks/TaskModal'
import type { Task } from '../types/task.types'
import '../styles/calendar.css'

interface Props {
  currentDate: Date
  registerCreateTask: (fn: () => void) => void
}

export default function CalendarPage({ currentDate, registerCreateTask }: Props) {
  const dispatch = useAppDispatch()
  const { items: tasks, isLoading, error } = useAppSelector(s => s.tasks)

  const [modalOpen, setModalOpen]     = useState(false)
  const [activeTask, setActiveTask]   = useState<Task | null>(null)
  const [clickedDate, setClickedDate] = useState<Date | null>(null)

  useEffect(() => {
    dispatch(loadTasks())
  }, [dispatch])

  // register the open-blank-modal function with AppShell
  // so the sidebar Create button can call it
  const openBlankModal = useCallback(() => {
    setActiveTask(null)
    setClickedDate(null)
    setModalOpen(true)
  }, [])

  useEffect(() => {
    registerCreateTask(openBlankModal)
  }, [registerCreateTask, openBlankModal])

  const handleSelectDate = (date: Date) => {
    dispatch(setSelectedDate(date.toISOString()))
    setActiveTask(null)
    setClickedDate(date)
    setModalOpen(true)
  }

  const handleSelectTask = (task: Task) => {
    setActiveTask(task)
    setClickedDate(null)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setActiveTask(null)
    setClickedDate(null)
  }

  if (isLoading && tasks.length === 0) {
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
    <>
      <CalendarGrid
        currentDate={currentDate}
        tasks={tasks}
        onSelectTask={handleSelectTask}
        onSelectDate={handleSelectDate}
      />

      {modalOpen && (
        <TaskModal
          task={activeTask}
          initialDate={clickedDate}
          onClose={handleCloseModal}
        />
      )}
    </>
  )
}