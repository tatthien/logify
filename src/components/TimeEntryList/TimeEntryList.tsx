import { Flex, Text } from "@mantine/core";
import { TimeEntryItem } from "../TimeEntryItem/TimeEntryItem";
import { TimeEntry } from "@/types";

type TimeEntryListProps = {
  timeEntries: TimeEntry[];
  onDelete?: () => void;
};

export function TimeEntryList({ timeEntries, onDelete }: TimeEntryListProps) {
  return (
    <Flex direction="column" gap={8}>
      {timeEntries.length > 0 ? (
        timeEntries.map((timeEntry) => (
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
        <Text c="gray-6" fz={14}>
          You have not logged time yet!
        </Text>
      )}
    </Flex>
  );
}
