import { useState } from 'react'
import { useAppDispatch } from '../../app/hooks'
import { addGroup } from '../../features/groups/groupsSlice'
import '../../styles/modal.css'

interface Props {
  onClose: () => void
}

export default function GroupModal({ onClose }: Props) {
  const dispatch = useAppDispatch()

  const [form, setForm] = useState({
    name: '',
    title: '',
    description: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) { setError('Name is required'); return }
    if (!form.title.trim()) { setError('Title is required'); return }

    setIsLoading(true)
    setError(null)

    const result = await dispatch(addGroup({
      name:        form.name.trim(),
      title:       form.title.trim(),
      description: form.description.trim() || undefined,
    }))

    setIsLoading(false)

    if (addGroup.fulfilled.match(result)) {
      onClose()
    } else {
      setError((result.payload as string) ?? 'Something went wrong')
    }
  }

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">New calendar</span>
          <button className="modal-close-btn" onClick={onClose}>&#x2715;</button>
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
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Dev Bucket"
              autoFocus
            />
          </div>

          <div className="modal-field">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Development Tasks"
            />
          </div>

          <div className="modal-field">
            <label htmlFor="description">Description (optional)</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="What is this calendar for?"
            />
          </div>

          <div className="modal-footer">
            <span />
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
                {isLoading ? 'Creating...' : 'Create calendar'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}