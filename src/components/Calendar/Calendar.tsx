import cx from "clsx";
import classes from "./Calendar.module.scss";
import { useCallback, useMemo, useState } from "react";
import { areDatesEqual } from "@/utils/areDatesEqual";
import { DateInput } from "@mantine/dates";

import {
  ActionIcon,
  Box,
  Button,
  Flex,
  Group,
  Modal,
  MultiSelect,
  NumberInput,
  Paper,
  Select,
  Text,
  Tooltip,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconCaretLeftFilled,
  IconCaretRightFilled,
} from "@tabler/icons-react";
import { Form, TimeEntry } from "@/types";
import { TimeEntryItem } from "../TimeEntryItem/TimeEntryItem";
import { formatDuration } from "@/utils/formatDuration";
import { useGetTimeEntriesQuery } from "@/hooks/useGetTimeEntriesQuery";
import { sendAnalytics } from "@/utils/sendAnalytics";
import { useGetSpacesQuery } from "@/hooks/useGetSpacesQuery";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useGetTagsQuery } from "@/hooks/useGetTagsQuery";
import { useGetTasksQuery } from "@/hooks/useGetTasksQuery";
import { useCreateTimeEntryMutation } from "@/hooks/useCreateTimeEntryMutation";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function Calendar() {
  const dateToday = new Date();
  const [opened, { close, open }] = useDisclosure();

  const [month, setMonth] = useState(dateToday.getMonth());
  const [year, setYear] = useState(dateToday.getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTimeEntries, setSelectedTimeEntries] = useState<TimeEntry[]>(
    []
  );

  const dates = useMemo<Date[]>(() => {
    const localDates: Date[] = [];
    const dayOne = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const prevMonthLastDate = new Date(year, month, 0).getDate();

    // Previous month's dates
    for (let i = dayOne; i > 1; i--) {
      const d = prevMonthLastDate - (i - 1) + 1;
      localDates.push(new Date(year, month - 1, d));
    }

    // Current month's dates
    for (let i = 1; i <= lastDate; i++) {
      localDates.push(new Date(year, month, i));
    }

    // Next month's dates
    const nextMonthDays = 42 - localDates.length;
    for (let i = 1; i <= nextMonthDays; i++) {
      localDates.push(new Date(year, month + 1, i));
    }

    return localDates;
  }, [month, year]);

  const { data: timeEntries, refetch } = useGetTimeEntriesQuery({
    start_date: dates[0].getTime().toString(),
    end_date: dates[dates.length - 1].getTime().toString(),
  });

  const getTimeEntriesOfDate = useCallback(
    (d: Date) => {
      if (!timeEntries) return [];

      return timeEntries.filter((timeEntry) => {
        const startDate = new Date(Number(timeEntry.start));
        return areDatesEqual(startDate, d);
      });
    },
    [timeEntries]
  );

  const totalWorkingHours = (timeEntries: TimeEntry[]): number => {
    const totalSeconds =
      timeEntries.reduce((acc, curr) => {
        return acc + Number(curr.duration);
      }, 0) / 1000;

    return totalSeconds / 3600;
  };

  const handleSelectPrevMonth = () => {
    const prevMonth = month - 1;
    if (prevMonth < 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(prevMonth);
    }
  };

  const handleSelectNextMonth = () => {
    const nextMonth = month + 1;
    if (nextMonth > 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(nextMonth);
    }
  };

  const handleSelectToday = () => {
    setMonth(dateToday.getMonth());
    setYear(dateToday.getFullYear());
  };

  return (
    <>
      <Paper withBorder shadow="md" p={16} mb={24}>
        <Flex justify="space-between" align="center" mb={16}>
          <Text fw={600} fz="lg">
            {months[month]} {year}
          </Text>
          <Flex gap={4}>
            <ActionIcon variant="default" onClick={handleSelectPrevMonth}>
              <IconCaretLeftFilled size={20} />
            </ActionIcon>
            <Button h={28} variant="default" onClick={handleSelectToday}>
              Today
            </Button>
            <ActionIcon variant="default" onClick={handleSelectNextMonth}>
              <IconCaretRightFilled size={20} />
            </ActionIcon>
          </Flex>
        </Flex>

        <Box className={classes.weekdays}>
          <Box>M</Box>
          <Box>T</Box>
          <Box>W</Box>
          <Box>T</Box>
          <Box>F</Box>
          <Box c={"orange.5"}>S</Box>
          <Box c={"orange.5"}>S</Box>
        </Box>

        <Box className={classes.dates}>
          {dates.map((date, i) => (
            <a
              href="#"
              key={i}
              onClick={(event) => {
                event.preventDefault();
                setSelectedDate(date);
                setSelectedTimeEntries(getTimeEntriesOfDate(date));

                if (process.env.NODE_ENV === "production") {
                  sendAnalytics("click", { date });
                }
              }}
              className={cx(
                classes.date,
                areDatesEqual(date, dateToday) && classes.today,
                selectedDate &&
                  areDatesEqual(date, selectedDate) &&
                  classes.selected,
                date.getMonth() !== month && classes.inactive,
                (date.getDay() === 6 || date.getDay() === 0) && classes.weekend
              )}
            >
              <Text component="span" className="date-number">
                {date.getDate()}
              </Text>
              {getTimeEntriesOfDate(date).length > 0 && (
                <Flex align="center" justify="center" gap={2}>
                  <Box
                    aria-label="time tracked indicator"
                    className={classes.timeTrackedIndicator}
                  ></Box>
                  {totalWorkingHours(getTimeEntriesOfDate(date)) < 8 && (
                    <Tooltip label="< 8 hours">
                      <Text c="orange.7" fz={0}>
                        <IconAlertCircle size={14} strokeWidth={2.5} />
                      </Text>
                    </Tooltip>
                  )}
                </Flex>
              )}
            </a>
          ))}
        </Box>
      </Paper>

      {selectedDate && (
        <Paper withBorder shadow="md" p={16}>
          <Flex mb={16} justify="space-between">
            <Text fz="md" fw={600}>{`${selectedDate.getDate()} ${
              months[selectedDate.getMonth()]
            } ${selectedDate.getFullYear()}`}</Text>

            <Text fz="md" fw={600}>
              {formatDuration(
                totalWorkingHours(selectedTimeEntries) * 3600 * 1000
              )}
            </Text>
          </Flex>

          <Flex direction="column" gap={8}>
            {selectedTimeEntries.length > 0 ? (
              selectedTimeEntries.map((timeEntry) => (
                <TimeEntryItem
                  key={`time-entry-${timeEntry.id}`}
                  data={timeEntry}
                />
              ))
            ) : (
              <Text color="gray-6">You have not logged time yet!</Text>
            )}
          </Flex>
        </Paper>
      )}
      <Paper>
        <Button fullWidth mt={20} onClick={open}>
          Add Log Time
        </Button>
        <ModalCreateTime refetch={refetch} opened={opened} close={close} />
      </Paper>
    </>
  );
}

function ModalCreateTime({
  opened,
  close,
  refetch,
}: {
  opened: boolean;
  close: () => void;
  refetch: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<TimeEntry[], Error>>;
}) {
  const { data: spaces } = useGetSpacesQuery();
  const { mutateAsync } = useCreateTimeEntryMutation();
  const [loading, setLoading] = useState(false);

  const form = useForm<Form>({
    initialValues: {
      spaceId: "",
      tid: "",
      duration: 0,
      start: new Date(),
      tags: [],
    },
  });

  const { data: tags } = useGetTagsQuery(form.values.spaceId);
  const { data: tasks } = useGetTasksQuery(form.values.spaceId);

  async function onSubmit(values: any) {
    setLoading(true);
    const data = {
      ...values,
      start: values.start.getTime(),
      duration: values.duration * 60 * 60 * 1000,
      tabs: values.tags
        .map((tag: string) => tags?.tags?.find((t) => t.name === tag))
        .filter(Boolean),
    };
    await mutateAsync(data);
    refetch();
    setLoading(false);
    close();
  }

  return (
    <Modal opened={opened} onClose={close} title="Add log time" centered>
      <Box>
        <form onSubmit={form.onSubmit(onSubmit)}>
          <Select
            label="Space"
            placeholder="Pick value"
            mb={20}
            data={spaces?.spaces?.map((space) => ({
              label: space.name,
              value: space.id,
            }))}
            clearable
            searchable
            {...form.getInputProps("spaceId")}
          />

          <Select
            label="Task"
            placeholder="Pick value"
            mb={20}
            data={tasks?.tasks?.map((task) => ({
              label: task.name,
              value: task.id,
            }))}
            clearable
            searchable
            {...form.getInputProps("tid")}
          />

          <MultiSelect
            label="Tags"
            mb={20}
            placeholder="Pick value"
            data={tags?.tags?.map((tag) => ({
              label: tag.name,
              value: tag.name,
            }))}
            {...form.getInputProps("tags")}
          />

          <NumberInput
            label="Duration (hour)"
            mb={20}
            placeholder="Input Duration"
            {...form.getInputProps("duration")}
          />

          <DateInput
            label="Date"
            mb={20}
            placeholder="date"
            {...form.getInputProps("start")}
          />

          <Group justify="center" gap="xl">
            <Button variant="outline" onClick={close}>
              Close
            </Button>
            <Button type="submit" loading={loading}>
              Submit
            </Button>
          </Group>
        </form>
      </Box>
    </Modal>
  );
}
