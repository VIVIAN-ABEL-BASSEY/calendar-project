export type TaskStatus = 'pending' | 'in-progress' | 'completed'
export type TaskPriority = 'low' | 'medium' | 'high'
export type TaskRecurrence = 'none' | 'daily' | 'weekly' | 'monthly'

// groupId can be a plain string ID or a populated object
export interface PopulatedGroup {
  _id: string
  name: string
}

export interface Task {
  _id: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  dueDate?: string | null
  groupId?: string | PopulatedGroup | null
  recurrence?: TaskRecurrence
  userId: string
  createdAt: string
  updatedAt: string
}

export interface CreateTaskPayload {
  title: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  dueDate?: string | null
  groupId?: string | null
  recurrence?: TaskRecurrence
}

export interface UpdateTaskPayload extends Partial<CreateTaskPayload> {}