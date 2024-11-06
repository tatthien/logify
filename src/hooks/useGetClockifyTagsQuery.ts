import { useQuery } from '@tanstack/react-query'

import { fetchClockifyTags } from '@/services/clockify/tag'
import { ClockifyTag } from '@/types'

export function useGetClockifyTagsQuery() {
  return useQuery<ClockifyTag[]>({
    queryKey: ['clockify-tags'],
    queryFn: () => fetchClockifyTags(),
  })
}
