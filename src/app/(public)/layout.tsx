'use client'
import { useEffect } from 'react'
import { Box } from '@mantine/core'
import { useRouter } from 'next/navigation'

import { supabase } from '@/utils/supabase/client'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        router.push('/')
      }
    })
  }, [])

  return <Box py={40}>{children}</Box>
}
