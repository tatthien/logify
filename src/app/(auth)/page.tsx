'use client'
import { Stack } from '@mantine/core'

import { Calendar } from '@/components/Calendar/Calendar'

export default function Home() {
  return (
    <Stack gap={12} component="main">
      <Calendar />
    </Stack>
  )
}
