// src/types/task.types.ts

export type TaskStatus = 'todo' | 'scheduled' | 'in-progress' | 'completed'

export interface Task {
  _id: string
  title: string
  description?: string
  status: TaskStatus
  dueDate?: string
  groupId?: string
  userId: string
  createdAt: string
  updatedAt: string
}

export interface CreateTaskPayload {
  title: string
  description?: string
  status?: TaskStatus
  dueDate?: string
  groupId?: string
}

export interface UpdateTaskPayload extends Partial<CreateTaskPayload> {}