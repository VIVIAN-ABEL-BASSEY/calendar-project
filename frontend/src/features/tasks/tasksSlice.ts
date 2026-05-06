import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as api from '../../api/tasks.api'
import type { Task, CreateTaskPayload, UpdateTaskPayload } from '../../types/task.types'

interface TasksState {
  items: Task[]
  isLoading: boolean
  error: string | null
}

const initialState: TasksState = {
  items: [],
  isLoading: false,
  error: null,
}

export const loadTasks = createAsyncThunk(
  'tasks/load',
  async (_, { rejectWithValue }) => {
    try {
      return await api.fetchTasks()
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? 'Failed to load tasks')
    }
  }
)

export const addTask = createAsyncThunk(
  'tasks/add',
  async (payload: CreateTaskPayload, { rejectWithValue }) => {
    try {
      return await api.createTask(payload)
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? 'Failed to create task')
    }
  }
)

export const editTask = createAsyncThunk(
  'tasks/edit',
  async (
    { id, payload }: { id: string; payload: UpdateTaskPayload },
    { rejectWithValue }
  ) => {
    try {
      return await api.updateTask(id, payload)
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? 'Failed to update task')
    }
  }
)

export const removeTask = createAsyncThunk(
  'tasks/remove',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.deleteTask(id)
      return id // return the id so we can remove it from state
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? 'Failed to delete task')
    }
  }
)

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // load
      .addCase(loadTasks.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loadTasks.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload
      })
      .addCase(loadTasks.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // add
      .addCase(addTask.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
      // edit
      .addCase(editTask.fulfilled, (state, action) => {
        const index = state.items.findIndex(t => t._id === action.payload._id)
        if (index !== -1) state.items[index] = action.payload
      })
      // remove
      .addCase(removeTask.fulfilled, (state, action) => {
        state.items = state.items.filter(t => t._id !== action.payload)
      })
  }
})

export default tasksSlice.reducer