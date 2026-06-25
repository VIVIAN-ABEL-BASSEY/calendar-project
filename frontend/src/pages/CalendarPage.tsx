import { useEffect, useState, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { loadTasks, editTask } from '../features/tasks/tasksSlice'
import { loadGroups } from '../features/groups/groupsSlice'
import { setSelectedDate } from '../features/calendar/calendarSlice'
import CalendarGrid from '../components/calendar/CalendarGrid'
import WeekView from '../components/calendar/WeekView'
import DayView from '../components/calendar/DayView'
import TaskModal from '../components/tasks/TaskModal'
import ToastContainer from '../components/ui/ToastContainer'
import Spinner from '../components/ui/Spinner'
import { useToastState } from '../hooks/useToast'
import type { Task } from '../types/task.types'
import '../styles/calendar.css'

interface Props {
  currentDate: Date
  registerCreateTask: (fn: () => void) => void
  registerSelectTask: (fn: (task: Task) => void) => void
}

export default function CalendarPage({ currentDate, registerCreateTask }: Props) {
  const dispatch = useAppDispatch()
  const { items: tasks, isLoading, error } = useAppSelector(s => s.tasks)
  const currentView = useAppSelector(s => s.calendar.view)

  const [modalOpen, setModalOpen]     = useState(false)
  const [activeTask, setActiveTask]   = useState<Task | null>(null)
  const [clickedDate, setClickedDate] = useState<Date | null>(null)

  const { toasts, showToast, removeToast } = useToastState()

  useEffect(() => {
    dispatch(loadTasks())
    dispatch(loadGroups())
  }, [dispatch])

  const openBlankModal = useCallback(() => {
    setActiveTask(null)
    setClickedDate(null)
    setModalOpen(true)
  }, [])

  useEffect(() => {
    registerCreateTask(openBlankModal)
  }, [registerCreateTask, openBlankModal])
  
  useEffect(() => {
    registerSelectTask(handleSelectTask)
  }, [registerSelectTask, tasks])

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

  // drag and drop handler — updates the task's due date
  const handleDropTask = async (taskId: string, newDate: Date) => {
    const task = tasks.find(t => t._id === taskId)
    if (!task) return

    // don't update if dropped on the same date
    if (task.dueDate && new Date(task.dueDate).toDateString() === newDate.toDateString()) return

    const result = await dispatch(editTask({
      id: taskId,
      payload: { dueDate: newDate.toISOString() }
    }))

    if (editTask.fulfilled.match(result)) {
      showToast('Task moved successfully', 'success')
    } else {
      showToast('Failed to move task', 'error')
    }
  }

  if (isLoading && tasks.length === 0) {
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        color: 'var(--color-text-muted)',
        fontSize: 14,
      }}>
        <Spinner />
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
      {currentView === 'month' && (
        <CalendarGrid
          currentDate={currentDate}
          tasks={tasks}
          onSelectTask={handleSelectTask}
          onSelectDate={handleSelectDate}
          onDropTask={handleDropTask}
        />
      )}

      {currentView === 'week' && (
        <WeekView
          currentDate={currentDate}
          tasks={tasks}
          onSelectTask={handleSelectTask}
          onSelectDate={handleSelectDate}
          onDropTask={handleDropTask}
        />
      )}

      {currentView === 'day' && (
        <DayView
          currentDate={currentDate}
          tasks={tasks}
          onSelectTask={handleSelectTask}
          onSelectDate={handleSelectDate}
          onDropTask={handleDropTask}
        />
      )}

      {modalOpen && (
        <TaskModal
          task={activeTask}
          initialDate={clickedDate}
          onClose={handleCloseModal}
          showToast={showToast}
        />
      )}

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  )
}