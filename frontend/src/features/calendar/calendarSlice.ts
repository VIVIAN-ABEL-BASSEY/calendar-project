import { createSlice } from '@reduxjs/toolkit'

export type CalendarView = 'month' | 'week' | 'day'

interface CalendarState {
  selectedDate: string | null
  view: CalendarView
  activeGroupId: string | null  // null means "show all groups"
}

const initialState: CalendarState = {
  selectedDate: null,
  view: 'month',
  activeGroupId: null,
}

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setSelectedDate(state, action) {
      state.selectedDate = action.payload
    },
    clearSelectedDate(state) {
      state.selectedDate = null
    },
    setView(state, action) {
      state.view = action.payload
    },
    // clicking the same group again clears the filter (toggle behaviour)
    setActiveGroupFilter(state, action) {
      state.activeGroupId = state.activeGroupId === action.payload
        ? null
        : action.payload
    },
    clearActiveGroupFilter(state) {
      state.activeGroupId = null
    }
  }
})

export const {
  setSelectedDate,
  clearSelectedDate,
  setView,
  setActiveGroupFilter,
  clearActiveGroupFilter,
} = calendarSlice.actions

export default calendarSlice.reducer