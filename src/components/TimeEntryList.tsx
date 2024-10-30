import { Divider, Flex, Stack, Text, Timeline } from "@mantine/core";
import { TimeEntryItem } from "./TimeEntryItem";
import { ClockifyTimeEntry } from "@/types";
import { IconMoodSad } from "@tabler/icons-react";

type TimeEntryListProps = {
  timeEntries: ClockifyTimeEntry[];
};

export function TimeEntryList({ timeEntries }: TimeEntryListProps) {
  const sortedTimeEntries = timeEntries.sort((a, b) => {
    const d1 = new Date(a.timeInterval.start);
    const d2 = new Date(b.timeInterval.start);
    return d1.getTime() - d2.getTime();
  });
  return (
    <Flex direction="column" gap={10}>
      {timeEntries.length > 0 ? (
        sortedTimeEntries.map((timeEntry) => (
          <TimeEntryItem key={`time-entry-${timeEntry.id}`} data={timeEntry} />
        ))
      ) : (
        <Stack gap={4} align="center">
          <Text c="dimmed" fz="sm">
            <IconMoodSad size={60} stroke={1.2} />
          </Text>
          <Text c="dimmed" fz="sm" span>
            You have not logged time yet!
          </Text>
        </Stack>
      )}
    </Flex>
  );
}


