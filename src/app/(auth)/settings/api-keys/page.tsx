'use client'

import { Stack } from '@mantine/core'
import { IconFingerprint, IconSettings } from '@tabler/icons-react'

import { CollapsibleCard } from '@/components/CollapsibleCard'
import { MisaScheduleForm } from '@/components/MisaScheduleForm'
import { SettingsForm } from '@/components/SettingsForm'

export default function Page() {
  return (
    <Stack gap={16} component="main">
      <CollapsibleCard icon={IconSettings} title="API keys">
        <SettingsForm />
      </CollapsibleCard>
      <CollapsibleCard icon={IconFingerprint} title="Misa">
        <MisaScheduleForm />
      </CollapsibleCard>
    </Stack>
  )
}
