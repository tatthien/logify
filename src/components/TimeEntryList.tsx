import { Divider, Flex, Text, Timeline } from "@mantine/core";
import { TimeEntryItem } from "./TimeEntryItem";
import { ClockifyTimeEntry } from "@/types";
import { IconMessageDots } from "@tabler/icons-react";

type TimeEntryListProps = {
  timeEntries: ClockifyTimeEntry[];
  onDelete?: () => void;
};

export function TimeEntryList({ timeEntries, onDelete }: TimeEntryListProps) {
  const sortedTimeEntries = timeEntries.sort((a, b) => {
    const d1 = new Date(a.timeInterval.start);
    const d2 = new Date(b.timeInterval.start);
    return d1.getTime() - d2.getTime();
  });
  return (
    <Flex direction="column" gap={10}>
      {timeEntries.length > 0 ? (
        sortedTimeEntries.map((timeEntry) => (
          <TimeEntryItem
            key={`time-entry-${timeEntry.id}`}
            data={timeEntry}
            onDelete={() => {
              if (onDelete) {
                onDelete();
              }
            }}
          />
        ))
      ) : (
        <Text c="dimmed" fz="sm">
          You have not logged time yet!
        </Text>
      )}
    </Flex>
  );
}
