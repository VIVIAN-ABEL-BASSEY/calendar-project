import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchGroups, createGroup } from '../../api/groups.api'
import type { TaskGroup, CreateGroupPayload } from '../../types/group.types'

interface GroupsState {
  items: TaskGroup[]
  isLoading: boolean
  error: string | null
}

const initialState: GroupsState = {
  items: [],
  isLoading: false,
  error: null,
}

export const loadGroups = createAsyncThunk(
  'groups/load',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchGroups()
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? 'Failed to load groups')
    }
  }
)

export const addGroup = createAsyncThunk(
  'groups/add',
  async (payload: CreateGroupPayload, { rejectWithValue }) => {
    try {
      return await createGroup(payload)
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? 'Failed to create group')
    }
  }
)

const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadGroups.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loadGroups.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload
      })
      .addCase(loadGroups.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(addGroup.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
  }
})

export default groupsSlice.reducer