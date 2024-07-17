import { useGetMembersQuery } from "@/hooks/useGetMembersQuery";
import { useGetTasksQuery } from "@/hooks/useGetTasksQuery";
import {
  Select,
  Flex,
  Text,
  Loader,
  SelectProps,
  Avatar,
  Stack,
  Group,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconCheck,
  IconPlaystationCircle,
  IconUser,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";

type TaskSelectProps = SelectProps & {
  spaceId: string;
};

export function TaskSelect({ spaceId, ...props }: TaskSelectProps) {
  const [includeClosedTasks, setIncludeClosedTasks] = useState(false);
  const [assignees, setAssignees] = useState<string[]>([]);
  const { data: tasks, isLoading: isLoadingTasks } = useGetTasksQuery({
    space_id: spaceId,
    include_closed: includeClosedTasks,
    assignees,
  });

  const { data: members, isLoading: isLoadingMembers } = useGetMembersQuery();

  const taskFiltersForm = useForm({
    initialValues: {
      assignee: "",
      taskStatus: "active",
    },
  });

  useEffect(() => {
    setIncludeClosedTasks(
      taskFiltersForm.values.taskStatus === "all" ? true : false,
    );

    setAssignees(
      taskFiltersForm.values.assignee ? [taskFiltersForm.values.assignee] : [],
    );
  }, [taskFiltersForm.values]);

  const renderTaskSelectOption: SelectProps["renderOption"] = ({
    option,
    checked,
  }) => {
    const task = tasks?.tasks.find(({ id }) => id === option.value);

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

  const renderAssigneeSelectOption: SelectProps["renderOption"] = ({
    option,
    checked,
  }) => {
    const member = members?.find(
      ({ user }) => user.id.toString() === option.value,
    );

    return (
      <Group gap={6} justify="space-between" align="center">
        <Avatar
          size="sm"
          alt="Avatar"
          src={member?.user.profilePicture}
          color={member?.user.color}
        >
          {member?.user.initials}
        </Avatar>
        <Text size="xs" fw={checked ? 600 : 400}>
          {option.label}
        </Text>
      </Group>
    );
  };

  return (
    <Select
      styles={{
        label: { width: "100%" },
      }}
      label={
        <Stack gap={0} mb={6}>
          <Text span fw={500} fz="sm">
            Task
          </Text>
          <Flex align="center" gap={6}>
            <Select
              flex={1}
              data={members?.map((member) => ({
                value: member.user.id.toString(),
                label: member.user.username,
              }))}
              placeholder="Assignee"
              size="xs"
              searchable
              clearable
              renderOption={renderAssigneeSelectOption}
              leftSection={<IconUser size={16} />}
              rightSection={isLoadingMembers && <Loader size="xs" />}
              {...taskFiltersForm.getInputProps("assignee")}
            />
            <Select
              flex={1}
              data={[
                { value: "all", label: "All tasks" },
                { value: "active", label: "Active tasks" },
              ]}
              placeholder="Task status"
              size="xs"
              leftSection={<IconPlaystationCircle size={16} />}
              {...taskFiltersForm.getInputProps("taskStatus")}
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
  );
}
