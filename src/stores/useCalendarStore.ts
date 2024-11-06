import { create } from 'zustand'

type CalendarState = {
  clockifyTimeEntriesQuery: any
  misaClockInRecordsQuery: any
}

type CalendarActions = {
  setClockifyTimeEntriesQuery: (query: any) => void
  setMisaClockInRecordsQuery: (query: any) => void
}

export const useCalendarStore = create<CalendarState & CalendarActions>((set) => ({
  clockifyTimeEntriesQuery: null,
  misaClockInRecordsQuery: null,
  setClockifyTimeEntriesQuery(query) {
    set({ clockifyTimeEntriesQuery: query })
  },
  setMisaClockInRecordsQuery(query) {
    set({ misaClockInRecordsQuery: query })
  },
}))
