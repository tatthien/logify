'use client'

import { Divider, Stack } from '@mantine/core'
import { IconFile } from '@tabler/icons-react'

import { CollapsibleCard } from '@/components/CollapsibleCard'
import { CreateTemplateForm } from '@/components/template/CreateTemplateForm'
import { TemplateList } from '@/components/template/TemplateList'

export default function Page() {
  return (
    <CollapsibleCard icon={IconFile} title="Templates">
      <Stack>
        <TemplateList />
        <Divider label="Create template" labelPosition="left" />
        <CreateTemplateForm />
      </Stack>
    </CollapsibleCard>
  )
}
