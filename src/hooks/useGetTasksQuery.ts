import { useQuery } from '@tanstack/react-query'

import { fetchTasks,FetchTasksParams } from '@/services/task'
import { Task } from '@/types'

export function useGetTasksQuery(params: FetchTasksParams) {
  return useQuery<{ tasks: Task[] }>({
    queryKey: ['tasks', params],
    queryFn: () => fetchTasks(params),
    enabled: !!params.space_id,
  })
}
