import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { Button, Divider, Flex, NumberInput, Stack, Textarea } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { modals } from '@mantine/modals'
import * as seline from '@seline-analytics/web'
import { useMutation } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { z } from 'zod'

import { useAuthentication } from '@/hooks/useAuthentication'
import { useGetClockifyTimeEntriesQuery } from '@/hooks/useGetClockifyTimeEntriesQuery'
import {
  CreateClockifyTimeEntryPayload,
  updateClockifyTimeEntry,
  UpdateClockifyTimeEntryPayload,
} from '@/services/clockify/time-entry'
import { useCalendarStore } from '@/stores/useCalendarStore'
import { ClockifyTimeEntry } from '@/types'

import { ClockifyProjectSelect } from './ClockifyProjectSelect'
import { ClockifyTagsMultiSelect } from './ClockifyTagsMultiSelect'

const DATE_FORMAT_LAYOUT = 'YYYY-MM-DDTHH:mm:ssZ'

interface UpdateTimeEntryFormProps {
  data: ClockifyTimeEntry
}

const schema = z.object({
  projectId: z.string().min(1, { message: 'Project is required' }),
  tagIds: z.array(z.string()).min(1, { message: 'Tags are required' }),
  duration: z.number({ message: 'Duration must be a number' }).min(0),
  description: z.string().max(2000),
})

type FormData = z.infer<typeof schema>

export function UpdateTimeEntryForm({ data }: UpdateTimeEntryFormProps) {
  const { user } = useAuthentication()
  const { clockifyTimeEntriesQuery } = useCalendarStore()
  const { refetch } = useGetClockifyTimeEntriesQuery(clockifyTimeEntriesQuery)
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (body: CreateClockifyTimeEntryPayload) => updateClockifyTimeEntry({ id: data.id, ...body }),
  })

  const form = useForm<FormData>({
    initialValues: {
      duration: 0,
      description: '',
      projectId: '',
      tagIds: [],
    },
    validate: zodResolver(schema)
  })

  useEffect(() => {
    form.setValues({
      tagIds: data.tagIds,
      projectId: data.projectId,
      description: data.description,
      duration: dayjs(data.timeInterval.end).diff(dayjs(data.timeInterval.start), 'minute') / 60,
    })
  }, [data])

  async function handleSubmit(values: FormData) {
    try {
      const payload: UpdateClockifyTimeEntryPayload = {
        id: data.id,
        description: values.description,
        tagIds: values.tagIds,
        projectId: values.projectId,
        start: data.timeInterval.start,
        end: dayjs(data.timeInterval.start).add(values.duration, 'hour').format(DATE_FORMAT_LAYOUT),
      }

      await mutateAsync(payload)
      toast.success('Time entry updated')
      refetch()
      modals.closeAll()

      seline.track('user:update-time-entry', {
        userId: user?.id,
        ...payload,
      })
    } catch (error: any) {
      toast.error(error.message || 'Failed to update time entry')
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
        <Stack gap={8}>
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
          <Textarea label="Description" placeholder="" rows={3} {...form.getInputProps('description')} />
        </Stack>
      </Stack>
      <Flex justify="flex-end" align="center" mt={16} gap={8}>
        <Button variant="default" onClick={() => modals.closeAll()}>
          Cancel
        </Button>
        <Button type="submit" loading={isPending}>
          Update
        </Button>
      </Flex>
    </form>
  )
}
