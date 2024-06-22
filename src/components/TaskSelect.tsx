import { useGetTasksQuery } from "@/hooks/useGetTasksQuery";
import {
  Select,
  Flex,
  Text,
  Loader,
  SelectProps,
  Avatar,
  Tooltip,
} from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";

type TaskSelectProps = SelectProps & {
  spaceId: string;
};

export function TaskSelect({ spaceId, ...props }: TaskSelectProps) {
  const { data: tasks, isLoading: isLoadingTasks } = useGetTasksQuery({
    space_id: spaceId,
    include_closed: false,
  });

  const renderTaskSelectOption: SelectProps["renderOption"] = ({
    option,
    checked,
  }) => {
    const task = tasks?.tasks.find(({ id }) => id === option.value);

    return (
      <Flex align="center" justify="space-between" w="100%" gap={8}>
        <Flex align="center" gap={4} style={{ flexShrink: 1 }}>
          {checked && <IconCheck size={16} />}
          <Text w={320} fz={14}>
            {option.label}
          </Text>
        </Flex>
        {task?.assignees.length ? (
          <Avatar.Group spacing="xs">
            {task?.assignees.map((assignee) => (
              <Tooltip key={assignee.id} label={assignee.username}>
                <Avatar
                  src={assignee.profilePicture}
                  size={28}
                  color={assignee.color || "gray"}
                >
                  {assignee.initials}
                </Avatar>
              </Tooltip>
            ))}
          </Avatar.Group>
        ) : (
          <Tooltip label="Unassigned">
            <Avatar size={28} color="gray" />
          </Tooltip>
        )}
      </Flex>
    );
  };

  return (
    <Select
      styles={{
        label: { width: "100%" },
      }}
      label="Task"
      placeholder="Select task"
      data={tasks?.tasks?.map((task) => ({
        label: task.name,
        value: task.id,
      }))}
      searchable
      disabled={!spaceId || isLoadingTasks}
      rightSection={isLoadingTasks && <Loader size="xs" type="dots" />}
      renderOption={renderTaskSelectOption}
      {...props}
    />
  );
}
