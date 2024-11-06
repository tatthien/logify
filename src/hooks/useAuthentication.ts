import { useContext } from 'react'

import { AuthProviderContext } from '@/providers/AuthProvider'

export function useAuthentication() {
  const context = useContext(AuthProviderContext)
  if (!context) {
    throw new Error('useGetUser must be used within an AuthProvider')
  }

  return {
    user: context.user,
    setUser: context.setUser,
  }
}
