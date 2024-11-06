'use client'

import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { Button, Flex, Stack, Text } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'

import { useAuthentication } from '@/hooks/useAuthentication'
import { useGetDefaultTimeEntrySettingsFormQuery } from '@/services/supabase'
import { supabase } from '@/utils/supabase/client'

import { ClockifyProjectSelect } from './ClockifyProjectSelect'
import { ClockifyTagsMultiSelect } from './ClockifyTagsMultiSelect'

const schema = z.object({
  projectId: z.string().nullable(),
  tagIds: z.array(z.string()),
})

type FormData = z.infer<typeof schema>

export function DefaultTimeEntrySettingsForm() {
  const { user } = useAuthentication()
  const form = useForm<FormData>({
    initialValues: {
      projectId: '',
      tagIds: [],
    },
    validate: zodResolver(schema),
  })

  const { data, refetch } = useGetDefaultTimeEntrySettingsFormQuery()
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: any) => {
      const { error } = await supabase.from('settings').upsert({
        id: data ? data.id : undefined,
        user_id: user?.id,
        key: 'default_time_entry_form_values', // @TODO: constant
        value: payload,
      })

      if (error) throw error
    },
  })

  useEffect(() => {
    if (!data) return
    form.setValues(data.value)
  }, [data])

  const handleSubmit = async (values: FormData) => {
    try {
      await mutateAsync(values)
      refetch()
      toast.success('Settings saved successfully')
    } catch (err: any) {
      toast.error(err.message || 'Failed to save settings')
    }
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Text fz="sm" c="dimmed">
        Set up default value for Project, Assignee or Tags when creating a new time entry.
      </Text>
      <Stack gap={8}>
        <ClockifyProjectSelect clearable {...form.getInputProps('projectId')} />
        <ClockifyTagsMultiSelect {...form.getInputProps('tagIds')} />
      </Stack>
      <Flex justify="flex-start" align="center" mt={16} gap={8}>
        <Button type="submit" loading={isPending}>
          Save
        </Button>
      </Flex>
    </form>
  )
}
