'use client'

import { Stack } from '@mantine/core'
import { IconLock, IconUserEdit } from '@tabler/icons-react'

import { ChangePasswordForm } from '@/components/ChangePasswordForm'
import { CollapsibleCard } from '@/components/CollapsibleCard'
import { DeleteAccountCard } from '@/components/DeleteAccountCard'
import { UpdateProfileForm } from '@/components/UpdateProfileForm'

export default function Page() {
  return (
    <Stack gap={16} component="main">
      <CollapsibleCard icon={IconUserEdit} title="Profile" id="profile_settings_card">
        <UpdateProfileForm />
      </CollapsibleCard>
      <CollapsibleCard icon={IconLock} title="Password" id="password_settings_card">
        <ChangePasswordForm />
      </CollapsibleCard>
      <DeleteAccountCard />
    </Stack>
  )
}
