'use client'

import { Stack, Text } from '@mantine/core'

import { useGetTemplates } from '@/services/supabase'

import { TemplateItem } from './TemplateItem'

export function TemplateList() {
  const { data, isLoading } = useGetTemplates()

  if (isLoading) {
    return (
      <Text c="gray.5" fz="sm" ta="center">
        Loading...
      </Text>
    )
  }

  if (!data?.length) {
    return (
      <Text c="gray.5" fz="sm" ta="center">
        No templates found
      </Text>
    )
  }

  return (
    <Stack gap={6}>
      {data.map((template) => (
        <TemplateItem key={template.id} template={template} />
      ))}
    </Stack>
  )
}
