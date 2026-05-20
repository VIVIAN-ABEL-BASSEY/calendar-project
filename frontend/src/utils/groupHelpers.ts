import type { PopulatedGroup } from '../types/task.types'

// groupId from backend can be a string or a populated object
// this always returns just the string ID
export function extractGroupId(
  groupId: string | PopulatedGroup | null | undefined
): string {
  if (!groupId) return ''
  if (typeof groupId === 'string') return groupId
  return groupId._id
}

// extract the group name if populated, for display purposes
export function extractGroupName(
  groupId: string | PopulatedGroup | null | undefined
): string | null {
  if (!groupId) return null
  if (typeof groupId === 'object') return groupId.name
  return null
}