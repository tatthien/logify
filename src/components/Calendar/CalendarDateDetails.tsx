import { Tabs, Button, Text, Flex, Paper, Badge, Stack } from "@mantine/core";
import { CreateTimeEntryForm } from "../CreateTimeEntryForm";
import { TimeEntryList } from "../TimeEntryList";
import { ClockifyTimeEntry } from "@/types";
import { formatDate } from "@/utils/formatDate";
import { useMemo, useState } from "react";
import { IconAlarm, IconAlarmPlus, IconClockPlus } from "@tabler/icons-react";
import { formatDuration } from "@/utils/formatDuration";
import { getDurationClockifyFromTimeEntry } from "@/helpers/getDurationFromClockifyTimeEntry";
import dayjs from "dayjs";
import { modals } from "@mantine/modals";

export type CalendarDateDetailsProps = {
  selectedDate: Date;
  misaTimeEntries: any[];
  clockifyTimeEntries: ClockifyTimeEntry[];
};

export function CalendarDateDetails({
  selectedDate,
  misaTimeEntries,
  clockifyTimeEntries,
}: CalendarDateDetailsProps) {
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
              leftSection={<IconClockPlus size={20} stroke={2.5} />}
              fw="600"
              fz="16"
              bg="green.0"
              c="green.9"
              onClick={() => {
                modals.open({
                  title: "Create time entry",
                  size: 426,
                  children: (
                    <CreateTimeEntryForm
                      date={selectedDate}
                      timeEntries={clockifyTimeEntries}
                    />
                  ),
                });
              }}
            >
              {formatDuration(totalWorkingHours * 3600 * 1000)}
            </Button>
          </Flex>

          <TimeEntryList timeEntries={clockifyTimeEntries} />
        </Tabs.Panel>

        <Tabs.Panel value="clock-in">
          <Stack gap={24}>
            {misaTimeEntries.length > 0 ? (
              <Stack gap={4}>
                {misaTimeEntries.map((item: any) => (
                  <Flex key={`clock-in-item-${item.Id}`} align="center" gap={8}>
                    <Badge variant="light" color="violet" radius="sm">
                      {item.WorkingShiftCode || "N/A"}
                    </Badge>
                    <Text fz="sm" fw="400" c="dimmed">
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
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </Paper>
  );
}
