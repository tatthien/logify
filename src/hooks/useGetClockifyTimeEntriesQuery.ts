import { useQuery } from '@tanstack/react-query'

import { fetchClockifyTimeEntries,FetchClockifyTimeEntryParams } from '@/services/clockify/time-entry'
import { ClockifyTimeEntry } from '@/types'

export function useGetClockifyTimeEntriesQuery(params: FetchClockifyTimeEntryParams) {
  return useQuery<ClockifyTimeEntry[]>({
    queryKey: ['clockify-time-entries', params],
    queryFn: () => fetchClockifyTimeEntries(params),
    enabled: !!params && !!params.userId,
  })
}
