import classes from "./Calendar.module.scss";
import { useCallback, useEffect, useState } from "react";

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
import { useCalendarStore } from "@/stores/useCalendarStore";
import { useCalendar } from "@/hooks/useCalendar";

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
  const { today, month, year, dates, prevMonth, nextMonth, jumpToToday } =
    useCalendar();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(today);
  const [settings] = useLocalStorage<AppSettings>({
    key: LOCAL_STORAGE_KEYS.APP_SETTINGS,
    defaultValue: { user: null },
  });
  const [sessionId] = useLocalStorage({
    key: LOCAL_STORAGE_KEYS.MISA_SESSION_ID,
    defaultValue: "",
  });

  const {
    clockifyTimeEntriesQuery,
    misaClockInRecordsQuery,
    setClockifyTimeEntriesQuery,
    setMisaClockInRecordsQuery,
  } = useCalendarStore();

  useEffect(() => {
    const firstDate = dates[0];
    const lastDate = dates[dates.length - 1];
    setClockifyTimeEntriesQuery({
      userId: settings.user ? settings.user.id : "",
      start: dayjs(firstDate).format("YYYY-MM-DDTHH:mm:ss") + "Z",
      end:
        dayjs(lastDate)
          .add(1, "day")
          .subtract(1, "second")
          .format("YYYY-MM-DDTHH:mm:ss") + "Z",
      "page-size": 150,
    });

    setMisaClockInRecordsQuery({
      sessionId,
      start: dayjs(firstDate).format("YYYY-MM-DD"),
      end: dayjs(lastDate).format("YYYY-MM-DD"),
    });
  }, [dates, settings.user, sessionId]);

  const { data: timeEntries, isLoading } = useGetClockifyTimeEntriesQuery(
    clockifyTimeEntriesQuery,
  );

  const { data: misaTimeEntries, refetch: refetchClockInRecords } =
    useGetMisaClockInRecordsQuery(misaClockInRecordsQuery);

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

  return (
    <Stack gap={16}>
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
            <Button ml={8} h={28} variant="light" onClick={jumpToToday}>
              Today
            </Button>
            <ActionIcon variant="light" onClick={prevMonth}>
              <IconArrowLeft size={20} />
            </ActionIcon>
            <ActionIcon variant="light" onClick={nextMonth}>
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
        />
      )}

      <ClockInButton onClockIn={refetchClockInRecords} />
    </Stack>
  );
}
