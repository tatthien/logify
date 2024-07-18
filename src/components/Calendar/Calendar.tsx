import classes from "./Calendar.module.scss";
import { useCallback, useMemo, useState } from "react";

import {
  ActionIcon,
  Box,
  Button,
  Flex,
  Loader,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { AppSettings } from "@/types";
import { useGetClockifyTimeEntriesQuery } from "@/hooks/useGetClockifyTimeEntriesQuery";
import dayjs from "dayjs";
import { useLocalStorage } from "@mantine/hooks";
import { LOCAL_STORAGE_KEYS } from "@/constants";
import { useGetMisaClockInRecordsQuery } from "@/hooks/useGetMisaClockInRecordsQuery";
import { CalendarDate } from "./CalendarDate";
import { CalendarDateDetails } from "./CalendarDateDetails";
import { areTwoDatesEqual } from "@/utils/areTwoDatesEqual";
import { ClockInButton } from "../ClockInButton";

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

const today = new Date();

export function Calendar() {
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(today);
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

  const { data: misaTimeEntries, refetch: refetchClockInRecords } =
    useGetMisaClockInRecordsQuery({
      sessionId,
      start: dayjs(firstDate).format("YYYY-MM-DD"),
      end: dayjs(lastDate).format("YYYY-MM-DD"),
    });

  const getTimeEntriesOfDate = useCallback(
    (d: Date) => {
      if (!timeEntries) return [];

      return timeEntries.filter((timeEntry) => {
        return areTwoDatesEqual(timeEntry.timeInterval.start, d);
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
    setMonth(today.getMonth());
    setYear(today.getFullYear());
  };

  return (
    <Stack gap={12}>
      <ClockInButton onClockIn={refetchClockInRecords} />
      <Paper p={16}>
        <Flex
          gap={6}
          justify="space-between"
          align="center"
          wrap="wrap"
          mb={16}
        >
          <Flex align="center" gap={8}>
            <Text fw={600}>
              {MONTHS[month]} {year}
            </Text>
            {isLoading && <Loader size="xs" />}
          </Flex>
          <Flex gap={4} align="center">
            <Button ml={8} h={28} variant="light" onClick={handleSelectToday}>
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
            <CalendarDate
              key={i}
              date={date}
              selectedDate={selectedDate}
              month={month}
              clockifyTimeEntries={getTimeEntriesOfDate(date)}
              misaTimeEntries={getMisaTimeEntriesOfDate(date)}
              onSelect={(date) => setSelectedDate(date)}
            />
          ))}
        </Box>
      </Paper>

      {selectedDate && (
        <CalendarDateDetails
          selectedDate={selectedDate}
          clockifyTimeEntries={getTimeEntriesOfDate(selectedDate)}
          misaTimeEntries={getMisaTimeEntriesOfDate(selectedDate)}
          onTimeEntryCreate={refetch}
          onTimeEntryDelete={refetch}
          onTimeEntryUpdate={refetch}
        />
      )}
    </Stack>
  );
}
