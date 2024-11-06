import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { ActionIcon, Button, Menu, Stack, Text, Tooltip } from '@mantine/core'
import { IconPlus, IconSparkles } from '@tabler/icons-react'
import { useMutation } from '@tanstack/react-query'
import dayjs from 'dayjs'
import Link from 'next/link'

import { parseDuration } from '@/helpers/parseDuration'
import { useGetClockifyTimeEntriesQuery } from '@/hooks/useGetClockifyTimeEntriesQuery'
import { createClockifyTimeEntry, CreateClockifyTimeEntryPayload } from '@/services/clockify/time-entry'
import { useGetTemplates } from '@/services/supabase'
import { useCalendarStore } from '@/stores/useCalendarStore'
import { Template } from '@/types'
import { areTwoDatesEqual } from '@/utils/areTwoDatesEqual'

const START_HOUR = 9
const DATE_FORMAT_LAYOUT = 'YYYY-MM-DDTHH:mm:ssZ'

export function CreateTimeEntryFromTemplates({ date }: { date: Date }) {
  const { data: templates } = useGetTemplates()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (body: CreateClockifyTimeEntryPayload) => createClockifyTimeEntry(body),
  })

  const { clockifyTimeEntriesQuery } = useCalendarStore()
  const { data: clockifyTimeEntries, refetch } = useGetClockifyTimeEntriesQuery(clockifyTimeEntriesQuery)

  const timeEntries = useMemo(() => {
    if (!clockifyTimeEntries) return []

    const data = clockifyTimeEntries.filter((timeEntry) => {
      return areTwoDatesEqual(timeEntry.timeInterval.start, date)
    })

    const sortedData = data.sort((a, b) => {
      return dayjs(a.timeInterval.start).diff(dayjs(b.timeInterval.start), 'hour') > 0 ? 1 : -1
    })

    return sortedData
  }, [clockifyTimeEntries, date])

  const handleCreateTimeEntry = async (template: Template) => {
    try {
      const dayStart = dayjs(date).startOf('day')

      const start =
        timeEntries.length === 0
          ? dayStart.add(START_HOUR, 'hour')
          : dayjs(timeEntries[timeEntries.length - 1].timeInterval.end)

      const startHour = start.hour() + start.minute() / 60

      const ranges = parseDuration(startHour, Number(template.value.duration))

      const payloads: CreateClockifyTimeEntryPayload[] = ranges.map((range) => ({
        projectId: template.value.projectId,
        description: template.value.description,
        tagIds: template.value.tagIds,
        start: dayStart.add(range[0], 'hour').format(DATE_FORMAT_LAYOUT),
        end: dayStart.add(range[1], 'hour').format(DATE_FORMAT_LAYOUT),
      }))

      await Promise.all(payloads.map((payload) => mutateAsync(payload)))
      toast.success('Time entry created')
      refetch()
    } catch (error) {
      toast.success('Failed to create time entry')
      console.error(error)
    }
  }

  return (
    <Menu>
      <Menu.Target>
        <Tooltip label="Create time entry from templates">
          <ActionIcon color="pink" variant="light" loading={isPending}>
            <IconSparkles />
          </ActionIcon>
        </Tooltip>
      </Menu.Target>
      <Menu.Dropdown>
        {!templates?.length && (
          <Menu.Item>
            <Stack align="center" gap={6}>
              <Text fz="sm" c="gray.5">
                No templates found
              </Text>
              <Button
                component={Link}
                prefetch={true}
                href="/settings/templates"
                color="pink"
                size="xs"
                fullWidth
                leftSection={<IconPlus size={16} />}
              >
                Create new
              </Button>
            </Stack>
          </Menu.Item>
        )}
        {templates?.map((template) => (
          <Menu.Item key={template.id} onClick={() => handleCreateTimeEntry(template)}>
            {template.name}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  )
}
