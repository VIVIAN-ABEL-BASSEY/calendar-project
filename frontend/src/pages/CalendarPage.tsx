import CalendarGrid from '../components/calendar/CalendarGrid'
import type { Task } from '../types/task.types'
import '../styles/calendar.css'

// some placeholder tasks so we can see the chips working
const PLACEHOLDER_TASKS: Task[] = [
  {
    _id: '1',
    title: 'Design review',
    status: 'todo',
    dueDate: new Date().toISOString(),
    userId: 'me',
    createdAt: '',
    updatedAt: '',
  },
  {
    _id: '2',
    title: 'Fix login bug',
    status: 'in-progress',
    dueDate: new Date().toISOString(),
    userId: 'me',
    createdAt: '',
    updatedAt: '',
  },
]

interface Props {
  currentDate: Date
}

export default function CalendarPage({ currentDate }: Props) {
  return (
    <CalendarGrid
      currentDate={currentDate}
      tasks={PLACEHOLDER_TASKS}
      onSelectTask={(task) => console.log('selected task', task)}
      onSelectDate={(date) => console.log('selected date', date)}
    />
  )
}