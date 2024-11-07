import { Divider, Stack, Text } from '@mantine/core'
import { IconFile } from '@tabler/icons-react'

import { CollapsibleCard } from '@/components/CollapsibleCard'
import { CreateTemplateForm } from '@/components/template/CreateTemplateForm'
import { TemplateList } from '@/components/template/TemplateList'

export default function Page() {
  return (
    <CollapsibleCard
      icon={
        <Text span fz={0} c="gray.5">
          <IconFile stroke={1.5} color="currentColor" />
        </Text>
      }
      title="Templates"
    >
      <Stack>
        <TemplateList />
        <Divider label="Create template" labelPosition="left" />
        <CreateTemplateForm />
      </Stack>
    </CollapsibleCard>
  )
}
