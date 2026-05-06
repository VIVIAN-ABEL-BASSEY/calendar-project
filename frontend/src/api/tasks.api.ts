// src/api/tasks.api.ts
import client from './axiosClient'
import type { Task, CreateTaskPayload, UpdateTaskPayload } from '../types/task.types'

interface FetchTasksResponse {
  message: string
  totalTasks: number
  currentPage: number
  totalPages: number
  tasks: Task[]
}

interface TaskResponse {
  message: string
  task: Task
}

export const fetchTasks = () =>
  client.get<FetchTasksResponse>('/tasks').then(r => r.data.tasks)

export const createTask = (payload: CreateTaskPayload) =>
  client.post<TaskResponse>('/tasks', payload).then(r => r.data.task)

export const updateTask = (id: string, payload: UpdateTaskPayload) =>
  client.patch<TaskResponse>(`/tasks/${id}`, payload).then(r => r.data.task)

export const deleteTask = (id: string) =>
  client.delete(`/tasks/${id}`)