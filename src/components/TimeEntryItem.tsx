import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { ActionIcon, Badge, Box, Button, Flex, Group, Text } from '@mantine/core'
import { modals } from '@mantine/modals'
import * as seline from '@seline-analytics/web'
import { IconArrowUpRight, IconPencil, IconTrash } from '@tabler/icons-react'
import { useMutation } from '@tanstack/react-query'
import dayjs from 'dayjs'

import { formatClockifyDuration } from '@/helpers/formatClockifyDuration'
import { useAuthentication } from '@/hooks/useAuthentication'
import { useGetClockifyProjectsQuery } from '@/hooks/useGetClockifyProjectsQuery'
import { useGetClockifyTagsQuery } from '@/hooks/useGetClockifyTagsQuery'
import { useGetClockifyTimeEntriesQuery } from '@/hooks/useGetClockifyTimeEntriesQuery'
import { deleteClockifyTimeEntry } from '@/services/clockify/time-entry'
import { useCalendarStore } from '@/stores/useCalendarStore'
import { ClockifyTimeEntry } from '@/types'

import { UpdateTimeEntryForm } from './UpdateTimeEntryForm'

type TimeEntryItemProps = {
  data?: ClockifyTimeEntry
}
export function TimeEntryItem({ data }: TimeEntryItemProps) {
  const { user } = useAuthentication()
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const { data: projects } = useGetClockifyProjectsQuery()
  const { data: tags } = useGetClockifyTagsQuery()
  const { clockifyTimeEntriesQuery } = useCalendarStore()
  const { refetch } = useGetClockifyTimeEntriesQuery(clockifyTimeEntriesQuery)

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (id: string) => deleteClockifyTimeEntry(id),
  })

  const project = useMemo(() => {
    if (!data || !projects) return

    return projects.find((p) => p.id === data.projectId)
  }, [data, projects])

  const itemTags = useMemo(() => {
    if (!data || !tags) return []

    return tags.filter((t) => data.tagIds.includes(t.id))
  }, [data, tags])

  const clickUpTaskURL = useMemo(() => {
    if (!data) return null
    // Attempt to extract the clickup task url from the description
    const regex = /(https:\/\/app.clickup.com\/t\/[a-z0-9]+)/
    const matches = data.description.match(regex)
    if (matches && matches.length) {
      return matches[0]
    }
    return null
  }, [data])

  async function handleDelete() {
    setShowDeleteConfirmation(false)
    if (!data) return
    await mutateAsync(data.id)
    toast.success('Time entry deleted')
    refetch()

    seline.track('user:delete-time-entry', {
      userId: user?.id,
    })
  }

  if (!data) {
    return
  }

  return (
    <Box
      style={{
        backgroundColor: `rgb(from ${project?.color} r g b / .05)`,
        padding: 6,
        borderRadius: 6,
        border: `1px solid ${project?.color}`,
        position: 'relative',
      }}
    >
      <Text fz={14} mb={4}>
        {data.description}
      </Text>
      {project && (
        <Text fz={12} fw={500} c={project?.color}>
          {project?.name}
        </Text>
      )}
      {itemTags.length > 0 && (
        <Text c="gray.6" fz={12} fw={500}>
          {itemTags.map((t) => `#${t.name}`).join(', ')}
        </Text>
      )}
      <Flex align="center" justify="space-between" gap={8}>
        <Flex align="center" justify="space-between" gap={8}>
          <Text
            ta="right"
            fz="12"
            fw={500}
            c="gray.7"
          >{`${dayjs(data.timeInterval.start).format('HH:mm')} - ${dayjs(data.timeInterval.end).format('HH:mm')}`}</Text>
          <Badge fz="12" tt={'lowercase'} fw="500" variant="default">
            {formatClockifyDuration(data.timeInterval.duration)}
          </Badge>
          {clickUpTaskURL && (
            <Button
              rightSection={<IconArrowUpRight size={16} />}
              component="a"
              href={clickUpTaskURL}
              target="_blank"
              size="compact-xs"
              variant="subtle"
              radius="xl"
              fw={500}
            >
              ClickUp
            </Button>
          )}
        </Flex>
        <Group gap={6}>
          {!showDeleteConfirmation && (
            <>
              <ActionIcon
                size="sm"
                variant="light"
                onClick={() =>
                  modals.open({
                    title: 'Update time entry',
                    size: 426,
                    centered: true,
                    children: <UpdateTimeEntryForm data={data} />,
                  })
                }
              >
                <IconPencil size={16} />
              </ActionIcon>
              <ActionIcon
                variant="light"
                size="sm"
                color="red"
                loading={isPending}
                onClick={() => setShowDeleteConfirmation(true)}
              >
                <IconTrash size={16} />
              </ActionIcon>
            </>
          )}
          {showDeleteConfirmation && (
            <Flex gap={6} align="center" pos="absolute" bottom={0} right={6}>
              <Button variant="transparent" p={0} fz={12} fw={500} color="red.5" onClick={handleDelete}>
                Yes
              </Button>
              <Button
                variant="transparent"
                p={0}
                fz={12}
                fw={500}
                color="gray.7"
                onClick={() => setShowDeleteConfirmation(false)}
              >
                No
              </Button>
            </Flex>
          )}
        </Group>
      </Flex>
    </Box>
  )
}
