import { TimeEntry } from "@/types";
import { formatDuration } from "@/utils/formatDuration";
import { Box, Flex, Text, Tooltip } from "@mantine/core";
import classes from "./TimeEntryItem.module.scss";

type TimeEntryItemProps = {
  data?: TimeEntry;
};
export function TimeEntryItem({ data }: TimeEntryItemProps) {
  return (
    <a href={data?.task_url} target="_blank" className={classes.timeentry}>
      <Flex align="center" gap={10}>
        <Tooltip label={data?.task.status.status.toUpperCase()}>
          <Box
            style={{ "--status-bg": data?.task.status.color }}
            className={classes.status}
          ></Box>
        </Tooltip>
        <Text className={classes.name} truncate>
          {data?.task.name}
        </Text>
        <Text className={classes.duration}>
          {formatDuration(Number(data?.duration))}
        </Text>
      </Flex>
    </a>
  );
}
