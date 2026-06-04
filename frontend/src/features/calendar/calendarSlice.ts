import { createSlice } from '@reduxjs/toolkit'

export type CalendarView = 'month' | 'week' | 'day'

interface CalendarState {
  selectedDate: string | null
  view: CalendarView
}

const initialState: CalendarState = {
  selectedDate: null,
  view: 'month',
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
    }
  }
})

export const { setSelectedDate, clearSelectedDate, setView } = calendarSlice.actions
export default calendarSlice.reducer