import { useCreateTimeEntryMutation } from "@/hooks/useCreateTimeEntryMutation";
import { useGetSpacesQuery } from "@/hooks/useGetSpacesQuery";
import { useGetTasksQuery } from "@/hooks/useGetTasksQuery";
import { Form } from "@/types";
import { sendAnalytics } from "@/utils/sendAnalytics";
import {
  Avatar,
  Button,
  Flex,
  Loader,
  NumberInput,
  Select,
  SelectProps,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { IconCheck } from "@tabler/icons-react";

interface CreateTimeEntryFormProps {
  date: Date;
  onCreate?: () => void;
}

export function CreateTimeEntryForm({
  date,
  onCreate,
}: CreateTimeEntryFormProps) {
  const [loading, setLoading] = useState(false);
  const { data: spaces } = useGetSpacesQuery();
  const { mutateAsync } = useCreateTimeEntryMutation();

  const form = useForm<Form>({
    initialValues: {
      spaceId: "",
      tid: "",
      duration: 0,
      start: new Date(),
    },
    validate: {
      spaceId: (value) => (value === "" ? "Please select a space" : null),
      tid: (value) => (value === "" ? "Please select a task" : null),
      duration: (value) =>
        value <= 0 ? "Duration must be greater than 0" : null,
    },
  });

  const { data: tasks, isLoading: isLoadingTasks } = useGetTasksQuery(
    form.values.spaceId,
  );

  const renderSpaceSelectOption: SelectProps["renderOption"] = ({
    option,
    checked,
  }) => {
    const space = spaces?.spaces.find(({ id }) => id === option.value);

    return (
      <Flex align="center" gap={8} w="100%">
        {checked && <IconCheck size={16} />}
        <Avatar
          variant="light"
          src={space?.avatar ?? null}
          color={space?.color}
          size={28}
          radius="md"
          alt={option.label}
        >
          {option.label[0]}
        </Avatar>
        <Text span fz={14}>
          {option.label}
        </Text>
      </Flex>
    );
  };

  const renderTaskSelectOption: SelectProps["renderOption"] = ({
    option,
    checked,
  }) => {
    const task = tasks?.tasks.find(({ id }) => id === option.value);

    return (
      <Flex align="center" justify="space-between" w="100%" gap={8}>
        <Flex align="center" gap={4}>
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

  async function handleSubmit(values: any) {
    setLoading(true);
    const data = {
      ...values,
      start: date.getTime(),
      duration: values.duration * 60 * 60 * 1000,
    };
    await mutateAsync(data);
    setLoading(false);

    if (process.env.NODE_ENV === "production") {
      sendAnalytics("create", { date });
    }

    if (onCreate) {
      onCreate();
    }
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap={8}>
        <Select
          label="Space"
          placeholder="Pick value"
          data={spaces?.spaces?.map((space) => ({
            label: space.name,
            value: space.id,
          }))}
          clearable
          searchable
          renderOption={renderSpaceSelectOption}
          {...form.getInputProps("spaceId")}
        />

        <Select
          label="Task"
          placeholder="Pick value"
          data={tasks?.tasks?.map((task) => ({
            label: task.name,
            value: task.id,
          }))}
          clearable
          searchable
          disabled={!form.values.spaceId || isLoadingTasks}
          rightSection={isLoadingTasks && <Loader size="xs" type="dots" />}
          renderOption={renderTaskSelectOption}
          {...form.getInputProps("tid")}
        />

        <NumberInput
          min={0}
          step={0.5}
          label="Duration (hour)"
          placeholder="Input Duration"
          {...form.getInputProps("duration")}
        />
      </Stack>
      <Flex justify="flex-end">
        <Button type="submit" loading={loading} mt={16}>
          Create
        </Button>
      </Flex>
    </form>
  );
}
