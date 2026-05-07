import { useState, useEffect } from 'react'
import { useAppDispatch } from '../../app/hooks'
import { addTask, editTask, removeTask } from '../../features/tasks/tasksSlice'
import type { Task, CreateTaskPayload, TaskStatus, TaskPriority } from '../../types/task.types'
import { format } from 'date-fns'
import '../../styles/modal.css'

interface Props {
  // if task is provided we're editing, otherwise creating
  task?: Task | null
  // if initialDate is provided we pre-fill the due date (clicked a cell)
  initialDate?: Date | null
  onClose: () => void
}

interface FormState {
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string
}

function getInitialForm(task?: Task | null, initialDate?: Date | null): FormState {
  if (task) {
    return {
      title:       task.title,
      description: task.description ?? '',
      status:      task.status,
      priority:    task.priority,
      dueDate:     task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : '',
    }
  }
  return {
    title:       '',
    description: '',
    status:      'pending',
    priority:    'medium',
    dueDate:     initialDate ? format(initialDate, 'yyyy-MM-dd') : '',
  }
}

export default function TaskModal({ task, initialDate, onClose }: Props) {
  const dispatch = useAppDispatch()
  const isEditing = Boolean(task)

  const [form, setForm] = useState<FormState>(() =>
    getInitialForm(task, initialDate)
  )
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // if the task prop changes (e.g. opening a different task) reset the form
  useEffect(() => {
    setForm(getInitialForm(task, initialDate))
    setError(null)
  }, [task, initialDate])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) {
      setError('Title is required')
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

          <div className="modal-footer">
            {isEditing ? (
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={isLoading}
              >
                Delete
              </button>
            ) : (
              <span />
            )}

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
                  ? isEditing ? 'Saving...' : 'Creating...'
                  : isEditing ? 'Save'      : 'Create task'
                }
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}