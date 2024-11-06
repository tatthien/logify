import { Stack, Text } from '@mantine/core'
import { IconFingerprint, IconSettings } from '@tabler/icons-react'

import { CollapsibleCard } from '@/components/CollapsibleCard'
import { Misa } from '@/components/Misa'
import { SettingsForm } from '@/components/SettingsForm'

export default function Page() {
  return (
    <Stack gap={12} component="main">
      <CollapsibleCard
        icon={
          <Text span fz={0} c="gray.5">
            <IconSettings stroke={1.5} color="currentColor" />
          </Text>
        }
        title="API keys"
      >
        <SettingsForm />
      </CollapsibleCard>
      <CollapsibleCard
        icon={
          <Text span fz={0} c="gray.5">
            <IconFingerprint stroke={1.5} color="currentColor" />
          </Text>
        }
        title="Misa"
      >
        <Misa />
      </CollapsibleCard>
    </Stack>
  )
}
