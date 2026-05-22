import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { addTask, editTask, removeTask } from '../../features/tasks/tasksSlice'
import type { Task, CreateTaskPayload, TaskStatus, TaskPriority } from '../../types/task.types'
import { extractGroupId } from '../../utils/groupHelpers'
import { sendReminder } from '../../api/notifications.api'
import { format } from 'date-fns'
import '../../styles/modal.css'

interface Props {
  task?: Task | null
  initialDate?: Date | null
  onClose: () => void
  showToast: (message: string, type: 'success' | 'error' | 'info') => void
}

interface FormState {
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string
  groupId: string
}

function getInitialForm(task?: Task | null, initialDate?: Date | null): FormState {
  if (task) {
    return {
      title:       task.title,
      description: task.description ?? '',
      status:      task.status,
      priority:    task.priority,
      dueDate:     task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : '',
      groupId:     extractGroupId(task.groupId),
    }
  }
  return {
    title:       '',
    description: '',
    status:      'pending',
    priority:    'medium',
    dueDate:     initialDate ? format(initialDate, 'yyyy-MM-dd') : '',
    groupId:     '',
  }
}

export default function TaskModal({ task, initialDate, onClose, showToast }: Props) {
  const dispatch = useAppDispatch()
  const isEditing = Boolean(task)
  const groups = useAppSelector(s => s.groups.items)
  const [form, setForm] = useState<FormState>(() =>
    getInitialForm(task, initialDate)
  )
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reminderLoading, setReminderLoading] = useState(false)

  // if the task prop changes (e.g. opening a different task) reset the form
  useEffect(() => {
    setForm(getInitialForm(task, initialDate))
    setError(null)
  }, [task, initialDate])

  useEffect(() => {
  if (groups.length > 0 && task?.groupId) {
      setForm(prev => ({
        ...prev,
        groupId: extractGroupId(task.groupId),
      }))
    }
  }, [groups, task])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) {
      setError('Title is required')
      groupId: form.groupId || null
      return
    }

    setIsLoading(true)
    setError(null)

    const payload: CreateTaskPayload = {
      title:       form.title.trim(),
      description: form.description.trim() || undefined,
      status:      form.status,
      priority:    form.priority,
      dueDate:     form.dueDate
        ? new Date(form.dueDate).toISOString()
        : null,
      groupId:     form.groupId || null,
    }

    let result

    if (isEditing && task) {
      result = await dispatch(editTask({ id: task._id, payload }))
    } else {
      result = await dispatch(addTask(payload))
    }

    setIsLoading(false)

    // check if the action succeeded or failed
    if (
      editTask.fulfilled.match(result) ||
      addTask.fulfilled.match(result)
    ) {
      onClose()
    } else {
      setError((result.payload as string) ?? 'Something went wrong')
    }
  }

  const handleDelete = async () => {
    if (!task) return
    const confirmed = window.confirm(`Delete "${task.title}"?`)
    if (!confirmed) return

    setIsLoading(true)
    await dispatch(removeTask(task._id))
    setIsLoading(false)
    onClose()
  }

  const handleSendReminder = async () => {
  if (!task) return
  if (!task.dueDate) {
    showToast('This task has no due date', 'error')
    return
  }
  setReminderLoading(true)
  try {
    await sendReminder(task._id)
    showToast('Reminder email sent successfully', 'success')
  } catch {
    showToast('Failed to send reminder', 'error')
  } finally {
    setReminderLoading(false)
  }
}

  // close when clicking the overlay background
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">
            {isEditing ? 'Edit task' : 'New task'}
          </span>
          <button className="modal-close-btn" onClick={onClose}>
            &#x2715;
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          {error && (
            <div style={{
              background: 'var(--color-error-bg)',
              color: 'var(--color-error)',
              fontSize: 13,
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
            }}>
              {error}
            </div>
          )}

          <div className="modal-field">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="Task title"
              autoFocus
            />
          </div>

          <div className="modal-field">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Add a description..."
            />
          </div>

          <div className="modal-row">
            <div className="modal-field">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="modal-field">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                name="priority"
                value={form.priority}
                onChange={handleChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="modal-field">
            <label htmlFor="dueDate">Due date</label>
            <input
              id="dueDate"
              name="dueDate"
              type="date"
              value={form.dueDate}
              onChange={handleChange}
            />
          </div>
          
          <div className="modal-field">
          <label htmlFor="groupId">Calendar</label>
            <select
            id="groupId"
            name="groupId"
            value={form.groupId}
            onChange={handleChange}
          >
            <option value="">No calendar</option>
            {groups.map(g => (
              <option key={g._id} value={g._id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>
        <div className="modal-footer">
          <div style={{ display: 'flex', gap: 8 }}>
            {isEditing && (
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={isLoading}
              >
                Delete
              </button>
            )}
            {isEditing && task?.dueDate && (
              <button
                type="button"
                className="btn btn-ghost"
                onClick={handleSendReminder}
                disabled={reminderLoading}
                title="Send reminder email"
              >
                {reminderLoading ? 'Sending...' : '🔔 Remind me'}
              </button>
            )}
            {!isEditing && <span />}
          </div>

          <div className="modal-footer-actions">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading
                ? isEditing ? 'Saving...'   : 'Creating...'
                : isEditing ? 'Save'        : 'Create task'
              }
            </button>
          </div>
        </div>
        </form>
      </div>
    </div>
  )
}