'use client'

import { IconClockPlus } from '@tabler/icons-react'

import { CollapsibleCard } from '@/components/CollapsibleCard'
import { DefaultTimeEntrySettingsForm } from '@/components/DefaultTimeEntrySettingsForm'

export default function Page() {
  return (
    <CollapsibleCard icon={IconClockPlus} title="Default form values">
      <DefaultTimeEntrySettingsForm />
    </CollapsibleCard>
  )
}
