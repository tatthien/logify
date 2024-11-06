import { useQuery } from '@tanstack/react-query'

import { fetchClockifyProjects } from '@/services/clockify/project'
import { ClockifyProject } from '@/types'

export function useGetClockifyProjectsQuery() {
  return useQuery<ClockifyProject[]>({
    queryKey: ['clockify-projects'],
    queryFn: () => fetchClockifyProjects(),
  })
}
