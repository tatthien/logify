import cx from "clsx";
import classes from "./Calendar.module.scss";
import { useCallback, useEffect, useMemo, useState } from "react";
import { areDatesEqual } from "@/utils/areDatesEqual";
import {
  ActionIcon,
  Box,
  Button,
  Flex,
  Paper,
  Text,
  Tooltip,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconCaretLeftFilled,
  IconCaretRightFilled,
} from "@tabler/icons-react";
import { useLocalStorage } from "@mantine/hooks";
import { TimeEntry } from "@/types";
import { TimeEntryItem } from "../TimeEntryItem/TimeEntryItem";
import { formatDuration } from "@/utils/formatDuration";
import { useGetTimeEntriesQuery } from "@/hooks/useGetTimeEntriesQuery";

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

  const [month, setMonth] = useState(dateToday.getMonth());
  const [year, setYear] = useState(dateToday.getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTimeEntries, setSelectedTimeEntries] = useState<TimeEntry[]>(
    [],
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

  const { data: timeEntries } = useGetTimeEntriesQuery({
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
    [timeEntries],
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
          <Box>S</Box>
          <Box>S</Box>
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
              }}
              className={cx(
                classes.date,
                areDatesEqual(date, dateToday) && classes.today,
                selectedDate &&
                  areDatesEqual(date, selectedDate) &&
                  classes.selected,
                date.getMonth() !== month && classes.inactive,
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
            <Text fz="lg" fw={600}>{`${selectedDate.getDate()} ${
              months[selectedDate.getMonth()]
            } ${selectedDate.getFullYear()}`}</Text>

            <Text fz="lg" fw={600}>
              {formatDuration(
                totalWorkingHours(selectedTimeEntries) * 3600 * 1000,
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
    </>
  );
}
