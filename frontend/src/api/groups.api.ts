import client from './axiosClient'
import type { TaskGroup, CreateGroupPayload } from '../types/group.types'

interface FetchGroupsResponse {
  message: string
  groups: TaskGroup[]
}

interface GroupResponse {
  message: string
  group: TaskGroup
}

export const fetchGroups = () =>
  client.get<FetchGroupsResponse>('/task-groups').then(r => r.data.groups)

export const createGroup = (payload: CreateGroupPayload) =>
  client.post<GroupResponse>('/task-groups', payload).then(r => r.data.group)