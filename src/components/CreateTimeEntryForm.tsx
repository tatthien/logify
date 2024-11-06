import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { Box, Button, Divider, Flex, NumberInput, Stack, Textarea } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { modals } from '@mantine/modals'
import * as seline from '@seline-analytics/web'
import { useMutation } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useLogger } from 'next-axiom'
import { z } from 'zod'

import { parseDuration } from '@/helpers/parseDuration'
import { useAuthentication } from '@/hooks/useAuthentication'
import { useGetClockifyTimeEntriesQuery } from '@/hooks/useGetClockifyTimeEntriesQuery'
import { createClockifyTimeEntry, CreateClockifyTimeEntryPayload } from '@/services/clockify/time-entry'
import { useGetDefaultTimeEntrySettingsFormQuery } from '@/services/supabase'
import { useCalendarStore } from '@/stores/useCalendarStore'
import { areTwoDatesEqual } from '@/utils/areTwoDatesEqual'

import { ClockifyProjectSelect } from './ClockifyProjectSelect'
import { ClockifyTagsMultiSelect } from './ClockifyTagsMultiSelect'

const START_HOUR = 9
const DATE_FORMAT_LAYOUT = 'YYYY-MM-DDTHH:mm:ssZ'

interface CreateTimeEntryFormProps {
  date: Date
}

const initialFormValues = {
  duration: 0,
  description: '',
  projectId: '',
  tagIds: [],
}

const schema = z.object({
  projectId: z.string().min(1, { message: 'Project is required' }),
  tagIds: z.array(z.string()).length(1, { message: 'Tags are required' }),
  duration: z.number({ message: 'Duration must be a number' }).min(0),
  description: z.string().max(2000),
})

type FormData = z.infer<typeof schema>

export function CreateTimeEntryForm({ date }: CreateTimeEntryFormProps) {
  const { user } = useAuthentication()
  const logger = useLogger()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (body: CreateClockifyTimeEntryPayload) => createClockifyTimeEntry(body),
    onSuccess: (body) => {
      seline.track('user:create-time-entry', {
        userId: user?.id,
        ...body,
      })
      logger.info('Time entry created', {
        userId: user?.id,
        ...body,
      })
    },
  })

  const { clockifyTimeEntriesQuery } = useCalendarStore()
  const { data: clockifyTimeEntries, refetch } = useGetClockifyTimeEntriesQuery(clockifyTimeEntriesQuery)
  const { data: settings } = useGetDefaultTimeEntrySettingsFormQuery()

  const form = useForm<FormData>({
    initialValues: { ...initialFormValues },
    validate: zodResolver(schema),
  })

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

  useEffect(() => {
    if (!settings) return

    const { tagIds, projectId } = settings.value

    form.setFieldValue('tagIds', tagIds || initialFormValues.tagIds)
    form.setFieldValue('projectId', projectId || initialFormValues.projectId)

    // For resetting
    form.setInitialValues({
      ...initialFormValues,
      tagIds: tagIds || initialFormValues.tagIds,
      projectId: projectId || initialFormValues.projectId,
    })
  }, [settings])

  async function handleSubmit(values: FormData) {
    try {
      const dayStart = dayjs(date).startOf('day')

      const start =
        timeEntries.length === 0
          ? dayStart.add(START_HOUR, 'hour')
          : dayjs(timeEntries[timeEntries.length - 1].timeInterval.end)

      const startHour = start.hour() + start.minute() / 60

      const ranges = parseDuration(startHour, Number(values.duration))

      const payloads: CreateClockifyTimeEntryPayload[] = ranges.map((range) => ({
        projectId: values.projectId,
        description: values.description,
        tagIds: values.tagIds,
        start: dayStart.add(range[0], 'hour').format(DATE_FORMAT_LAYOUT),
        end: dayStart.add(range[1], 'hour').format(DATE_FORMAT_LAYOUT),
      }))

      await Promise.all(payloads.map((payload) => mutateAsync(payload)))
      toast.success('Time entry created')
      refetch()
      form.reset()
    } catch (error) {
      toast.success('Failed to create time entry')
      console.error(error)
    }
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack
        gap={4}
        style={{
          backgroundImage: 'linear-gradient(#03a9f442, transparent)',
          padding: '0.5rem',
          paddingBottom: '1rem',
          borderRadius: '0.5rem',
        }}
      >
        <Divider
          label="Clockify"
          labelPosition="left"
          color="rgb(from #03a9f4 r g b / .3)"
          styles={{ label: { color: '#03a9f4', fontWeight: 600 } }}
        />
        <Box>
          <ClockifyProjectSelect withAsterisk {...form.getInputProps('projectId')} />
          <ClockifyTagsMultiSelect withAsterisk {...form.getInputProps('tagIds')} />
          <NumberInput
            min={0}
            step={0.5}
            label="Duration (hour)"
            placeholder="E.g: 1.5"
            withAsterisk
            {...form.getInputProps('duration')}
          />
          <Textarea
            label="Description"
            placeholder="The description will be auto populated when you select ClickUp task."
            rows={3}
            {...form.getInputProps('description')}
          />
        </Box>
      </Stack>
      <Flex justify="flex-end" align="center" mt={16} gap={8}>
        <Button variant="default" onClick={() => modals.closeAll()}>
          Cancel
        </Button>
        <Button type="submit" loading={isPending}>
          Create
        </Button>
      </Flex>
    </form>
  )
}
