export interface TaskGroup {
  _id: string
  name: string
  title: string
  description?: string
  userId: string
  createdAt: string
  updatedAt: string
}

export interface CreateGroupPayload {
  name: string
  title: string
  description?: string
}