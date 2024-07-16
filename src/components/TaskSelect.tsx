import { useGetTasksQuery } from "@/hooks/useGetTasksQuery";
import {
  Select,
  Flex,
  Text,
  Loader,
  SelectProps,
  Avatar,
  Tooltip,
  Switch,
  Stack,
  Divider,
  Group,
} from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { useState } from "react";

type TaskSelectProps = SelectProps & {
  spaceId: string;
};

export function TaskSelect({ spaceId, ...props }: TaskSelectProps) {
  const [includeClosedTasks, setIncludeClosedTasks] = useState(false);
  const { data: tasks, isLoading: isLoadingTasks } = useGetTasksQuery({
    space_id: spaceId,
    include_closed: includeClosedTasks,
  });

  const renderTaskSelectOption: SelectProps["renderOption"] = ({
    option,
    checked,
  }) => {
    const task = tasks?.tasks.find(({ id }) => id === option.value);

    return (
      <Stack w="100%" gap={0}>
        <Flex align="center" gap={4} style={{ flexShrink: 1 }}>
          {checked && <IconCheck size={16} />}
          <Text fz={14}>{option.label}</Text>
        </Flex>
        {task?.assignees.length ? (
          <Group>
            {task?.assignees.map((assignee) => (
              <Text
                key={`${task.id}-${assignee.id}`}
                color={assignee.color}
                fz={12}
                fw={500}
              >
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
    );
  };

  return (
    <Select
      styles={{
        label: { width: "100%" },
      }}
      label={
        <Flex justify="space-between" align="center" w="100%" mb={4}>
          <Text span fw={500} fz="sm">
            Task (Optional)
          </Text>
          <Flex align="center" gap={4}>
            <Switch
              id="include-closed"
              size="xs"
              checked={includeClosedTasks}
              onChange={(event) =>
                setIncludeClosedTasks(event.currentTarget.checked)
              }
              labelPosition="left"
              label="Include closed tasks"
            />
          </Flex>
        </Flex>
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
  );
}
