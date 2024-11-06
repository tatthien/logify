'use client'

import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { Button, Flex, NumberInput, Stack, Textarea, TextInput } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'

import { useAuthentication } from '@/hooks/useAuthentication'
import { useGetTemplates } from '@/services/supabase'
import { Template } from '@/types'
import { supabase } from '@/utils/supabase/client'

import { ClockifyProjectSelect } from '../ClockifyProjectSelect'
import { ClockifyTagsMultiSelect } from '../ClockifyTagsMultiSelect'

type CreateTemplateFormProps = {
  data?: Template
}

const schema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  projectId: z.string().min(1, { message: 'Project is required' }),
  tagIds: z.array(z.string()).min(1, { message: 'Tags are required' }),
  duration: z.number({ message: 'Duration must be a number' }).min(0),
  description: z.string().max(2000),
})

type FormData = z.infer<typeof schema>

export function CreateTemplateForm({ data }: CreateTemplateFormProps) {
  const { user } = useAuthentication()
  const { refetch } = useGetTemplates()

  const form = useForm<FormData>({
    initialValues: {
      name: '',
      projectId: '',
      tagIds: [],
      duration: 0,
      description: '',
    },
    validate: zodResolver(schema),
  })

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: any) => {
      const { error } = await supabase.from('templates').upsert({
        id: data ? data.id : undefined,
        user_id: user?.id,
        name: payload.name,
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
      form.reset()
      toast.success('Template created successfully')
    } catch (err: any) {
      toast.error(err.message || 'Failed to create template')
    }
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap={8}>
        <TextInput
          withAsterisk
          label="Template name"
          placeholder="Enter template name"
          {...form.getInputProps('name')}
        />
        <ClockifyProjectSelect withAsterisk clearable {...form.getInputProps('projectId')} />
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
      <Flex justify="flex-start" align="center" mt={16} gap={8}>
        <Button type="submit" loading={isPending}>
          Save
        </Button>
      </Flex>
    </form>
  )
}
