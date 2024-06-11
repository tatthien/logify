import { TimeEntry } from "@/types";
import { formatDuration } from "@/utils/formatDuration";
import { ActionIcon, Box, Flex, Text, Tooltip, lighten } from "@mantine/core";
import classes from "./TimeEntryItem.module.scss";
import { IconTrash } from "@tabler/icons-react";
import { MouseEvent, useState } from "react";
import { useDeleteTimeEntryMutation } from "@/hooks/useDeleteTimeEntryMutation";

type TimeEntryItemProps = {
  data?: TimeEntry;
  onDelete?: () => void;
};
export function TimeEntryItem({ data, onDelete }: TimeEntryItemProps) {
  const { mutateAsync } = useDeleteTimeEntryMutation();
  const [isLoading, setIsLoading] = useState(false);

  async function handleDelete(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    if (!data) return;
    setIsLoading(true);
    await mutateAsync(data.id);
    if (onDelete) {
      onDelete();
    }
    setIsLoading(false);
  }

  if (!data) {
    return;
  }

  return (
    <a href={data.task_url} target="_blank" className={classes.timeentry}>
      <Flex align="center" gap={10}>
        <Tooltip label={data.task.status.status.toUpperCase()}>
          <Box
            style={{
              "--status-bg": lighten(data.task.status.color as string, 0.9),
              "--status-bd-color": data.task.status.color,
            }}
            className={classes.status}
          ></Box>
        </Tooltip>
        <Text className={classes.name} truncate>
          {data.task.name}
        </Text>
        <Text className={classes.duration}>
          {formatDuration(Number(data?.duration))}
        </Text>
        <ActionIcon
          variant="subtle"
          size="sm"
          color="red"
          loading={isLoading}
          onClick={handleDelete}
        >
          <IconTrash size={16} />
        </ActionIcon>
      </Flex>
    </a>
  );
}
