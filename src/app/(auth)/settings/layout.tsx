import { Box } from '@mantine/core'

import { SettingsNav } from '@/components/SettingsNav'

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box pos="relative">
      {children}
      <SettingsNav />
    </Box>
  )
}
