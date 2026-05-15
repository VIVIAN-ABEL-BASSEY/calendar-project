import { configureStore } from '@reduxjs/toolkit'
import authReducer    from '../features/auth/authSlice'
import tasksReducer   from '../features/tasks/tasksSlice'
import calendarReducer from '../features/calendar/calendarSlice'
import groupsReducer  from '../features/groups/groupsSlice'

export const store = configureStore({
  reducer: {
    auth:     authReducer,
    tasks:    tasksReducer,
    calendar: calendarReducer,
    groups:   groupsReducer,
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch