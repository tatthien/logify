'use client'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Alert, Button, Flex, LoadingOverlay, PasswordInput, Stack, Switch, Text } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { IconAlertTriangle } from '@tabler/icons-react'
import { z } from 'zod'

import { useAuthentication } from '@/hooks/useAuthentication'
import { useCreateClockInScheduleMutation, useGetClockInSchedulesQuery } from '@/services/supabase'

import { MisaScheduleCalendar } from './MisaScheduleCalendar/MisaScheduleCalendar'

const schema = z.object({
  sessionId: z.string(),
  schedule: z.string().array(),
  active: z.boolean(),
})

type FormData = z.infer<typeof schema>

type MisaScheduleFormProps = {
  onSubmit?: (data: FormData) => void
}

export function MisaScheduleForm({ onSubmit }: MisaScheduleFormProps) {
  const [scheduleId, setScheduleId] = useState<string>()
  const { user } = useAuthentication()
  const { data, isLoading, refetch } = useGetClockInSchedulesQuery()
  const { mutateAsync, isPending } = useCreateClockInScheduleMutation()

  const form = useForm<FormData>({
    initialValues: {
      sessionId: '',
      schedule: [],
      active: true,
    },
    validate: zodResolver(schema),
  })

  useEffect(() => {
    if (data) {
      form.setFieldValue('sessionId', data.session_id)
      form.setFieldValue('schedule', data.schedule ?? [])
      form.setFieldValue('active', data.active)
      setScheduleId(data.id)
    }
  }, [data])

  const handleSubmit = async (values: FormData) => {
    try {
      await mutateAsync({
        id: scheduleId,
        session_id: values.sessionId,
        schedule: values.schedule,
        active: values.active,
        user_id: user?.id,
      })

      refetch()

      toast.success('Saved successfully')

      if (onSubmit) {
        onSubmit(values)
      }
    } catch (error: any) {
      toast.error(error.message)
    }
  }
  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap={8} pos="relative">
        <PasswordInput
          label="Session ID"
          placeholder="0xxx"
          description="This session is stored in local storage, use it at your own risk."
          {...form.getInputProps('sessionId')}
        />
        <Stack gap={0}>
          <Text fw={500} fz="sm">
            Auto clock in
          </Text>
          <Text c="dimmed" fz="xs" mb={8}>
            The system will use your schedule below to clock in automatically at 9:00 AM and 9:30 AM every day (GMT+7).
          </Text>

          <Switch mb={8} label="Enable auto clock in" checked={form.values.active} {...form.getInputProps('active')} />

          <Alert icon={<IconAlertTriangle />} bg={'orange.0'} color="orange" variant="outline" mt={4} mb={12}>
            Auth clock in feature is temporary not available due to the cron job issue. Make sure to clock in manually
            every day.
          </Alert>

          <MisaScheduleCalendar
            value={form.values.schedule}
            disabled={!form.values.active}
            onChange={(value) => form.setFieldValue('schedule', value)}
          />
        </Stack>
        <LoadingOverlay visible={isLoading} loaderProps={{ size: 'sm' }} />
      </Stack>
      <Flex justify="flex-start" align="center" mt={16} gap={8}>
        <Button type="submit" loading={isPending} disabled={isPending}>
          Save
        </Button>
      </Flex>
    </form>
  )
}
