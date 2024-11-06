import { useQuery } from '@tanstack/react-query'

import { fetctMembers } from '@/services/member'

export const useGetMembersQuery = () => {
  return useQuery({
    queryKey: ['members'],
    queryFn: fetctMembers,
  })
}
