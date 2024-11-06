import { createContext } from 'react'
import { User } from '@supabase/supabase-js'

export type AuthProviderContextValue = {
  user: User | null
  setUser: (user: User | null) => void
}

export const AuthProviderContext = createContext<AuthProviderContextValue>({
  user: null,
  setUser: () => {},
})

type AuthProviderProps = {
  children: React.ReactNode
  value: AuthProviderContextValue
}

export function AuthProvider({ value, children }: AuthProviderProps) {
  return <AuthProviderContext.Provider value={value}>{children}</AuthProviderContext.Provider>
}
