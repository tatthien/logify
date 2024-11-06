import { useQuery } from '@tanstack/react-query'

import { fetchTimeEntries } from '@/services/time-entry'
import { TimeEntry } from '@/types'

export function useGetTimeEntriesQuery(params = {}) {
  return useQuery<TimeEntry[]>({
    queryKey: ['time-entries', params],
    queryFn: () => fetchTimeEntries(params),
  })
}
