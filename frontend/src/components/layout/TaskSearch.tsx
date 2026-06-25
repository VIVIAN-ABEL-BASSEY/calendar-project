import { useState, useRef, useEffect } from 'react'
import { format } from 'date-fns'
import { useAppSelector } from '../../app/hooks'
import type { Task } from '../../types/task.types'

interface Props {
  onSelectTask: (task: Task) => void
}

export default function TaskSearch({ onSelectTask }: Props) {
  const tasks = useAppSelector(s => s.tasks.items)
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const results = query.trim()
    ? tasks.filter(t =>
        t.title.toLowerCase().includes(query.trim().toLowerCase())
      )
    : []

  // close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (task: Task) => {
    onSelectTask(task)
    setQuery('')
    setIsOpen(false)
  }

  const handleClear = () => {
    setQuery('')
    setIsOpen(false)
  }

  return (
    <div className="topbar-search" ref={wrapperRef}>
      <span className="topbar-search-icon">&#128269;</span>
      <input
        type="text"
        placeholder="Search tasks..."
        value={query}
        onChange={e => {
          setQuery(e.target.value)
          setIsOpen(true)
        }}
        onFocus={() => query && setIsOpen(true)}
      />
      {query && (
        <button className="topbar-search-clear" onClick={handleClear}>
          &#x2715;
        </button>
      )}

      {isOpen && query.trim() && (
        <div className="search-results-dropdown">
          {results.length === 0 ? (
            <div className="search-no-results">No tasks found</div>
          ) : (
            results.map(task => (
              <div
                key={task._id}
                className="search-result-item"
                onClick={() => handleSelect(task)}
              >
                <span className="search-result-title">{task.title}</span>
                {task.dueDate && (
                  <span className="search-result-date">
                    {format(new Date(task.dueDate), 'MMM d')}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}