import cx from "clsx";
import classes from "./Calendar.module.scss";
import { useCallback, useMemo, useState } from "react";
import { areDatesEqual } from "@/utils/areDatesEqual";

import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Flex,
  Group,
  Loader,
  Paper,
  Stack,
  Tabs,
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
import { AppSettings, ClockifyTimeEntry } from "@/types";
import { formatDuration } from "@/utils/formatDuration";
import { sendAnalytics } from "@/utils/sendAnalytics";
import { CreateTimeEntryForm } from "../CreateTimeEntryForm";
import { formatDate } from "@/utils/formatDate";
import { TimeEntryList } from "../TimeEntryList";
import { useGetClockifyTimeEntriesQuery } from "@/hooks/useGetClockifyTimeEntriesQuery";
import dayjs from "dayjs";
import { getDurationClockifyFromTimeEntry } from "@/helpers/getDurationFromClockifyTimeEntry";
import { useLocalStorage } from "@mantine/hooks";
import { LOCAL_STORAGE_KEYS } from "@/constants";
import { useGetMisaClockInRecordsQuery } from "@/hooks/useGetMisaClockInRecordsQuery";

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
  const [settings] = useLocalStorage<AppSettings>({
    key: LOCAL_STORAGE_KEYS.APP_SETTINGS,
    defaultValue: { user: null },
  });
  const [sessionId] = useLocalStorage({
    key: LOCAL_STORAGE_KEYS.MISA_SESSION_ID,
    defaultValue: "",
  });

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
  } = useGetClockifyTimeEntriesQuery({
    userId: settings.user ? settings.user.id : "",
    start: dayjs(firstDate).format("YYYY-MM-DDTHH:mm:ss") + "Z",
    end:
      dayjs(lastDate)
        .add(1, "day")
        .subtract(1, "second")
        .format("YYYY-MM-DDTHH:mm:ss") + "Z",
    "page-size": 150,
  });

  const { data: misaTimeEntries } = useGetMisaClockInRecordsQuery({
    sessionId,
    start: dayjs(firstDate).format("YYYY-MM-DD"),
    end: dayjs(lastDate).format("YYYY-MM-DD"),
  });

  const getTimeEntriesOfDate = useCallback(
    (d: Date) => {
      if (!timeEntries) return [];

      return timeEntries.filter((timeEntry) => {
        const startDate = new Date(timeEntry.timeInterval.start);
        return areDatesEqual(startDate, d);
      });
    },
    [timeEntries],
  );

  const getMisaTimeEntriesOfDate = useCallback(
    (d: Date) => {
      if (!misaTimeEntries) return [];
      const data = misaTimeEntries.Data.PageData;
      return data.filter((item: any) => {
        return dayjs(item.CheckTime).isSame(d, "day");
      });
    },
    [misaTimeEntries],
  );

  const selectedTimeEntries = useMemo(() => {
    if (!timeEntries || !selectedDate) return [];

    return timeEntries.filter((timeEntry) => {
      return areDatesEqual(
        new Date(timeEntry.timeInterval.start),
        selectedDate,
      );
    });
  }, [timeEntries, selectedDate]);

  const totalWorkingHours = (timeEntries: ClockifyTimeEntry[]): number => {
    const totalSeconds =
      timeEntries.reduce((acc, curr) => {
        return acc + getDurationClockifyFromTimeEntry(curr);
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
                  <Group gap={4}>
                    <Box
                      aria-label="time tracked indicator"
                      className={cx(
                        classes.timeTrackedIndicator,
                        getTimeEntriesOfDate(date).length > 0 &&
                          classes.timeTrackedIndicatorActive,
                      )}
                    ></Box>
                    {getMisaTimeEntriesOfDate(date).length > 0 && (
                      <Box
                        aria-label="misa clock in indicator"
                        className={cx(
                          classes.timeTrackedIndicator,
                          classes.misaClockInIndicatorActive,
                        )}
                      ></Box>
                    )}
                  </Group>

                  {getTimeEntriesOfDate(date).length > 0 &&
                    // Show the alert when the total hour is less than 8
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
                    timeEntries={selectedTimeEntries}
                    onCreate={() => refetch()}
                  />
                </Paper>
              )}

              <TimeEntryList
                timeEntries={selectedTimeEntries}
                onDelete={refetch}
              />
            </Tabs.Panel>

            <Tabs.Panel value="clock-in">
              {getMisaTimeEntriesOfDate(selectedDate).length > 0 ? (
                <Stack gap={4}>
                  {getMisaTimeEntriesOfDate(selectedDate).map((item: any) => (
                    <Flex key={item.id} align="center" gap={4}>
                      <Badge variant="light" color="violet" radius="sm">
                        {item.WorkingShiftCode || "N/A"}
                      </Badge>
                      <Text fz="sm" fw="500">
                        {dayjs(item.CheckTime).format("YYYY-MM-DD H:mm:ss")}
                      </Text>
                    </Flex>
                  ))}
                </Stack>
              ) : (
                <Text color="dimmed" fz="sm" ta="center">
                  No records found
                </Text>
              )}
            </Tabs.Panel>
          </Tabs>
        </Paper>
      )}
    </>
  );
}
