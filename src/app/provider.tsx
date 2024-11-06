'use client'

import { useEffect } from 'react'
import { MantineProvider } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import * as seline from '@seline-analytics/web'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { supabase } from '@/utils/supabase/client'

import { theme } from './theme'

type AppProviderProps = {
  children: React.ReactNode
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
    },
  },
})

export function AppProvider({ children }: AppProviderProps) {
  useEffect(() => {
    seline.init()
    supabase.auth.onAuthStateChange(() => { })
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme} defaultColorScheme="light">
        <ModalsProvider>{children}</ModalsProvider>
      </MantineProvider>
    </QueryClientProvider>
  )
}
