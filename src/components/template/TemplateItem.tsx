import { useState } from 'react'
import toast from 'react-hot-toast'
import { ActionIcon, Box, Button, Divider, Group, Stack, Text } from '@mantine/core'
import {
  IconCategory,
  IconClock,
  IconLetterT,
  IconMinus,
  IconPlus,
  IconTag,
  IconTrash,
} from '@tabler/icons-react'
import { useMutation } from '@tanstack/react-query'

import { useGetClockifyProjectsQuery } from '@/hooks/useGetClockifyProjectsQuery'
import { useGetClockifyTagsQuery } from '@/hooks/useGetClockifyTagsQuery'
import { useGetTemplates } from '@/services/supabase'
import { Template } from '@/types'
import { supabase } from '@/utils/supabase/client'

import classes from './TemplateItem.module.css'

export function TemplateItem({ template }: { template: Template }) {
  const [collapsed, setCollapsed] = useState(true)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const { refetch } = useGetTemplates()
  const { data: tags } = useGetClockifyTagsQuery()
  const { data: projects } = useGetClockifyProjectsQuery()

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['delete-template'],
    mutationFn: async () => {
      const { error } = await supabase.from('templates').delete().eq('id', template.id)
      if (error) throw error
    },
  })

  const project = projects?.find((p) => p.id === template.value.projectId)

  const handleDelete = async () => {
    try {
      await mutateAsync()
      setConfirmDelete(false)
      refetch()
      toast.success('Template deleted successfully')
    } catch (err: any) {
      toast.error('Failed to delete template')
      console.error(err)
    }
  }

  return (
    <Box className={classes.root}>
      <Group className={classes.header} onClick={() => setCollapsed(!collapsed)}>
        <Text fz="sm" fw={500}>
          {template.name}
        </Text>
        {collapsed ? <IconPlus size={20} /> : <IconMinus size={20} />}
      </Group>
      <Stack gap={4} display={collapsed ? 'none' : 'flex'} py={6}>
        <Group align="center" gap={12}>
          <IconCategory size={16} />
          <Text fz="sm" c={project?.color}>
            {project?.name}
          </Text>
        </Group>
        <Group align="center" gap={12} wrap="nowrap">
          <IconTag size={16} style={{ flexShrink: 0 }} />
          <Group gap={4}>
            <Text fz="sm">
              {template.value.tagIds.length
                ? template.value.tagIds
                  .map((tagId) => {
                    const tag = tags?.find((t) => t.id === tagId)
                    return `#${tag?.name}`
                  })
                  .join(', ')
                : '—'}
            </Text>
          </Group>
        </Group>
        <Group align="center" gap={12}>
          <IconClock size={16} />
          <Text fz="sm">{template.value.duration}h</Text>
        </Group>
        <Group align="center" gap={12}>
          <IconLetterT size={16} />
          <Text fz="sm">{template.value.description || '—'}</Text>
        </Group>
        <Divider my={6} />
        <Group gap={6} align="center">
          {!confirmDelete ? (
            <>
              <ActionIcon
                size="sm"
                variant="light"
                color="red"
                loading={isPending}
                onClick={() => setConfirmDelete(true)}
              >
                <IconTrash size={16} color="currentColor" />
              </ActionIcon>
            </>
          ) : (
            <Group gap={4}>
              <Button variant="transparent" size="xs" color="red" p={0} fw={500} onClick={handleDelete}>
                Yes
              </Button>
              <Button variant="transparent" size="xs" p={0} fw={500} onClick={() => setConfirmDelete(false)}>
                No
              </Button>
            </Group>
          )}
        </Group>
      </Stack>
    </Box>
  )
}
