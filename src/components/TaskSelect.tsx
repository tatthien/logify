import { useEffect, useState } from 'react'
import { Flex, Group, Loader, Select, SelectProps, Stack, Text } from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconCheck, IconPlaystationCircle } from '@tabler/icons-react'

import { useGetTasksQuery } from '@/hooks/useGetTasksQuery'
import { useGetDefaultTimeEntrySettingsFormQuery } from '@/services/supabase'

import { MemberSelect } from './MemberSelect'

type TaskSelectProps = SelectProps & {
  spaceId: string | null
}

export function TaskSelect({ spaceId, ...props }: TaskSelectProps) {
  const [includeClosedTasks, setIncludeClosedTasks] = useState(false)
  const [assignees, setAssignees] = useState<string[]>([])
  const { data: tasks, isLoading: isLoadingTasks } = useGetTasksQuery({
    space_id: spaceId,
    include_closed: includeClosedTasks,
    assignees,
  })
  const { data: settings } = useGetDefaultTimeEntrySettingsFormQuery()

  const taskFiltersForm = useForm({
    initialValues: {
      assignee: '',
      taskStatus: 'active',
    },
  })

  useEffect(() => {
    setIncludeClosedTasks(taskFiltersForm.values.taskStatus === 'all' ? true : false)

    setAssignees(taskFiltersForm.values.assignee ? [taskFiltersForm.values.assignee] : [])
  }, [taskFiltersForm.values])

  useEffect(() => {
    if (!settings) return
    const { assigneeId } = settings.value
    taskFiltersForm.setFieldValue('assignee', assigneeId || '')

    // Form resetting
    taskFiltersForm.setInitialValues({
      assignee: assigneeId || '',
      taskStatus: 'active',
    })
  }, [settings])

  const renderTaskSelectOption: SelectProps['renderOption'] = ({ option, checked }) => {
    const task = tasks?.tasks.find(({ id }) => id === option.value)

    return (
      <Stack w="100%" gap={0}>
        <Flex align="center" gap={4} style={{ flexShrink: 1 }}>
          {checked && <IconCheck size={16} />}
          <Text lineClamp={2} fz={14}>
            {option.label}
          </Text>
        </Flex>
        {task?.assignees.length ? (
          <Group>
            {task?.assignees.map((assignee) => (
              <Text key={`${task.id}-${assignee.id}`} color={assignee.color} fz={12} fw={500}>
                {assignee.username}
              </Text>
            ))}
          </Group>
        ) : (
          <Text fz={12} fw={500} c="gray.4">
            Unassigned
          </Text>
        )}
      </Stack>
    )
  }

  return (
    <Select
      styles={{
        label: { width: '100%' },
      }}
      label={
        <Stack gap={0} mb={6}>
          <Text span fw={500} fz="sm">
            Task
          </Text>
          <Flex align="center" gap={6}>
            <MemberSelect
              flex={1}
              placeholder="Assignee"
              size="xs"
              searchable
              clearable
              {...taskFiltersForm.getInputProps('assignee')}
            />
            <Select
              flex={1}
              data={[
                { value: 'all', label: 'All tasks' },
                { value: 'active', label: 'Active tasks' },
              ]}
              placeholder="Task status"
              size="xs"
              leftSection={<IconPlaystationCircle size={16} />}
              {...taskFiltersForm.getInputProps('taskStatus')}
            />
          </Flex>
        </Stack>
      }
      placeholder="Select task"
      data={tasks?.tasks?.map((task) => ({
        label: task.name,
        value: task.id,
      }))}
      searchable
      disabled={!spaceId || isLoadingTasks}
      rightSection={isLoadingTasks && <Loader size="xs" />}
      renderOption={renderTaskSelectOption}
      {...props}
    />
  )
}
