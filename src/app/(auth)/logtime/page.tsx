import { Stack, Text } from '@mantine/core'
import { IconClockPlus } from '@tabler/icons-react'

import { CollapsibleCard } from '@/components/CollapsibleCard'
import { DefaultTimeEntrySettingsForm } from '@/components/DefaultTimeEntrySettingsForm'

export default function Page() {
  return (
    <Stack gap={12} component="main">
      <CollapsibleCard
        icon={
          <Text span fz={0} c="gray.5">
            <IconClockPlus stroke={1.5} color="currentColor" />
          </Text>
        }
        title="Default form values"
        id="default_form_values_card"
      >
        <DefaultTimeEntrySettingsForm />
      </CollapsibleCard>
    </Stack>
  )
}
