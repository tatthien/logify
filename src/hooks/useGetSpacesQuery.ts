import { useQuery } from '@tanstack/react-query'

import { fetchSpaces } from '@/services/space'
import { Space } from '@/types'

export function useGetSpacesQuery() {
  return useQuery<{ spaces: Space[] }>({
    queryKey: ['spaces'],
    queryFn: () => fetchSpaces(),
  })
}
