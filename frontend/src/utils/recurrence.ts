import { isSameDay, isBefore, startOfDay, differenceInCalendarDays } from 'date-fns'
import type { Task } from '../types/task.types'

interface OccurrenceCheck {
  occurs: boolean
  isAnchor: boolean // true only if this IS the literal dueDate stored in the database
}

export function taskOccursOnDate(task: Task, date: Date): OccurrenceCheck {
  if (!task.dueDate) return { occurs: false, isAnchor: false }

  const anchor = new Date(task.dueDate)
  const recurrence = task.recurrence ?? 'none'

  // the literal stored date always counts as the anchor occurrence
  if (isSameDay(anchor, date)) {
    return { occurs: true, isAnchor: true }
  }

  // non-recurring tasks only occur on their exact due date
  if (recurrence === 'none') {
    return { occurs: false, isAnchor: false }
  }

  // recurrence never projects backwards before the original anchor date
  if (isBefore(startOfDay(date), startOfDay(anchor))) {
    return { occurs: false, isAnchor: false }
  }

  if (recurrence === 'daily') {
    return { occurs: true, isAnchor: false }
  }

  if (recurrence === 'weekly') {
    const diffDays = differenceInCalendarDays(startOfDay(date), startOfDay(anchor))
    return { occurs: diffDays % 7 === 0, isAnchor: false }
  }

  if (recurrence === 'monthly') {
    return { occurs: date.getDate() === anchor.getDate(), isAnchor: false }
  }

  return { occurs: false, isAnchor: false }
}