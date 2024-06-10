import cx from "clsx";
import classes from "./Calendar.module.scss";
import { useCallback, useMemo, useState } from "react";
import { areDatesEqual } from "@/utils/areDatesEqual";

import {
  ActionIcon,
  Box,
  Button,
  Flex,
  Loader,
  Paper,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import {
  IconAlarm,
  IconAlertCircle,
  IconArrowLeft,
  IconArrowRight,
  IconX,
} from "@tabler/icons-react";
import { TimeEntry } from "@/types";
import { formatDuration } from "@/utils/formatDuration";
import { useGetTimeEntriesQuery } from "@/hooks/useGetTimeEntriesQuery";
import { sendAnalytics } from "@/utils/sendAnalytics";
import { CreateTimeEntryForm } from "../CreateTimeEntryForm/CreateTimeEntryForm";
import { formatDate } from "@/utils/formatDate";
import { TimeEntryList } from "../TimeEntryList/TimeEntryList";

const MONTHS = [
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
  const [timeEntryFormOpened, setTimeEntryFormOpened] = useState(false);

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

  const firstDate = useMemo(() => dates[0], [dates]);
  const lastDate = useMemo(() => dates[dates.length - 1], [dates]);

  const {
    data: timeEntries,
    refetch,
    isLoading,
  } = useGetTimeEntriesQuery({
    start_date: firstDate.getTime().toString(),
    end_date: lastDate.getTime().toString(),
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

  const selectedTimeEntries = useMemo(() => {
    if (!timeEntries || !selectedDate) return [];

    return timeEntries.filter((timeEntry) => {
      return areDatesEqual(new Date(Number(timeEntry.start)), selectedDate);
    });
  }, [timeEntries, selectedDate]);

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
      <Paper p={16} mb={24}>
        <Flex justify="space-between" align="center" mb={16}>
          <Flex align="center" gap={8}>
            <Text fw={600} fz="lg">
              {MONTHS[month]} {year}
            </Text>
            {isLoading && <Loader size="xs" />}
          </Flex>
          <Flex gap={4}>
            <Button h={28} variant="light" onClick={handleSelectToday}>
              Today
            </Button>
            <ActionIcon variant="light" onClick={handleSelectPrevMonth}>
              <IconArrowLeft size={20} />
            </ActionIcon>
            <ActionIcon variant="light" onClick={handleSelectNextMonth}>
              <IconArrowRight size={20} />
            </ActionIcon>
          </Flex>
        </Flex>

        <Box className={classes.weekdays}>
          <Box>MO</Box>
          <Box>TU</Box>
          <Box>WE</Box>
          <Box>TH</Box>
          <Box>FR</Box>
          <Box c={"orange.5"}>SA</Box>
          <Box c={"orange.5"}>SU</Box>
        </Box>

        <Box className={classes.dates}>
          {dates.map((date, i) => (
            <a
              href="#"
              key={i}
              onClick={(event) => {
                event.preventDefault();
                setSelectedDate(date);

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
                (date.getDay() === 6 || date.getDay() === 0) && classes.weekend,
              )}
            >
              <Box className={classes.inner}>
                <Text component="span" className={classes.dateNumber}>
                  {date.getDate()}
                </Text>
                <Flex align="center" justify="center" gap={2}>
                  <Box
                    aria-label="time tracked indicator"
                    className={cx(
                      classes.timeTrackedIndicator,
                      getTimeEntriesOfDate(date).length > 0 &&
                        classes.timeTrackedIndicatorActive,
                    )}
                  ></Box>
                  {getTimeEntriesOfDate(date).length > 0 &&
                    totalWorkingHours(getTimeEntriesOfDate(date)) < 8 && (
                      <Tooltip label="< 8 hours">
                        <Text
                          c="orange.7"
                          fz={0}
                          style={{
                            position: "absolute",
                            top: "0.375rem",
                            right: "0.375rem",
                          }}
                        >
                          <IconAlertCircle size={14} strokeWidth={2.5} />
                        </Text>
                      </Tooltip>
                    )}
                </Flex>
              </Box>
            </a>
          ))}
        </Box>
      </Paper>

      {selectedDate && (
        <Paper p={16}>
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
              onClick={() => setTimeEntryFormOpened(!timeEntryFormOpened)}
            >
              {formatDuration(
                totalWorkingHours(selectedTimeEntries) * 3600 * 1000,
              )}
            </Button>
          </Flex>

          {timeEntryFormOpened && (
            <Paper withBorder shadow="none" px={12} py={12} mb={16}>
              <Flex mb={8} align="center" justify="space-between">
                <Title
                  order={4}
                  fw={500}
                  fz={16}
                >{`Tracking time for ${formatDate(selectedDate)}`}</Title>
                <ActionIcon
                  variant="transparent"
                  onClick={() => setTimeEntryFormOpened(false)}
                >
                  <IconX size={20} />
                </ActionIcon>
              </Flex>
              <CreateTimeEntryForm
                date={selectedDate}
                onCreate={() => refetch()}
              />
            </Paper>
          )}

          <TimeEntryList timeEntries={selectedTimeEntries} onDelete={refetch} />
        </Paper>
      )}
    </>
  );
}
