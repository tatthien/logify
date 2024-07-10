import { Tabs, Button, Text, Flex, Paper, Badge, Stack } from "@mantine/core";
import { CreateTimeEntryForm } from "../CreateTimeEntryForm";
import { TimeEntryList } from "../TimeEntryList";
import { ClockifyTimeEntry } from "@/types";
import { formatDate } from "@/utils/formatDate";
import { useMemo, useState } from "react";
import { IconAlarm } from "@tabler/icons-react";
import { formatDuration } from "@/utils/formatDuration";
import { getDurationClockifyFromTimeEntry } from "@/helpers/getDurationFromClockifyTimeEntry";
import dayjs from "dayjs";

export type CalendarDateDetailsProps = {
  selectedDate: Date;
  misaTimeEntries: any[];
  clockifyTimeEntries: ClockifyTimeEntry[];
  onTimeEntryCreate?: () => void;
  onTimeEntryDelete?: () => void;
};

export function CalendarDateDetails({
  selectedDate,
  misaTimeEntries,
  clockifyTimeEntries,
  onTimeEntryCreate,
  onTimeEntryDelete,
}: CalendarDateDetailsProps) {
  const [formOpened, setFormOpened] = useState(false);

  const totalWorkingHours = useMemo(() => {
    const totalSeconds =
      clockifyTimeEntries.reduce((acc, curr) => {
        return acc + getDurationClockifyFromTimeEntry(curr);
      }, 0) / 1000;

    return totalSeconds / 3600;
  }, [clockifyTimeEntries]);

  return (
    <Paper p={16}>
      <Tabs defaultValue="log-time">
        <Tabs.List mb={16}>
          <Tabs.Tab value="log-time">Log time</Tabs.Tab>
          <Tabs.Tab value="clock-in">Clock in</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="log-time">
          <Flex mb={16} align="center" justify="space-between">
            <Text fz="md" fw={600}>
              {formatDate(selectedDate)}
            </Text>

            <Button
              variant="light"
              size="compact-md"
              leftSection={<IconAlarm size={20} />}
              fw="600"
              fz="16"
              bg="green.0"
              c="green.9"
              onClick={() => setFormOpened(!formOpened)}
            >
              {formatDuration(totalWorkingHours * 3600 * 1000)}
            </Button>
          </Flex>

          {formOpened && (
            <Paper withBorder shadow="none" px={12} py={12} mb={16}>
              <CreateTimeEntryForm
                date={selectedDate}
                timeEntries={clockifyTimeEntries}
                onCreate={() => {
                  if (onTimeEntryCreate) onTimeEntryCreate();
                }}
              />
            </Paper>
          )}

          <TimeEntryList
            timeEntries={clockifyTimeEntries}
            onDelete={() => {
              if (onTimeEntryDelete) onTimeEntryDelete();
            }}
          />
        </Tabs.Panel>

        <Tabs.Panel value="clock-in">
          {misaTimeEntries.length > 0 ? (
            <Stack gap={4}>
              {misaTimeEntries.map((item: any) => (
                <Flex key={`clock-in-item-${item.Id}`} align="center" gap={4}>
                  <Badge variant="light" color="violet" radius="sm">
                    {item.WorkingShiftCode || "N/A"}
                  </Badge>
                  <Text fz="sm" fw="500">
                    {dayjs(item.CheckTime).format("YYYY-MM-DD HH:mm:ss")}
                  </Text>
                </Flex>
              ))}
            </Stack>
          ) : (
            <Text c="dimmed" fz="sm" ta="center">
              No records found
            </Text>
          )}
        </Tabs.Panel>
      </Tabs>
    </Paper>
  );
}
