import { useCallback, useEffect, useState } from 'react'
import { ActionIcon, Box, Button, Flex, Loader, Paper, Stack, Text } from '@mantine/core'
import { useLocalStorage } from '@mantine/hooks'
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react'
import dayjs from 'dayjs'

import { LOCAL_STORAGE_KEYS } from '@/constants'
import { useCalendar } from '@/hooks/useCalendar'
import { useGetClockifyTimeEntriesQuery } from '@/hooks/useGetClockifyTimeEntriesQuery'
import { useGetMisaClockInRecordsQuery } from '@/hooks/useGetMisaClockInRecordsQuery'
import { useGetClockInSchedulesQuery } from '@/services/supabase'
import { useCalendarStore } from '@/stores/useCalendarStore'
import { AppSettings } from '@/types'
import { areTwoDatesEqual } from '@/utils/areTwoDatesEqual'

import { ClockInButton } from '../ClockInButton'

import { CalendarDate } from './CalendarDate'
import { CalendarDateDetails } from './CalendarDateDetails'

import classes from './Calendar.module.scss'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function Calendar() {
  const { today, month, year, dates, prevMonth, nextMonth, jumpToToday } = useCalendar()

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(today)
  const [settings] = useLocalStorage<AppSettings>({
    key: LOCAL_STORAGE_KEYS.APP_SETTINGS,
    defaultValue: { user: null },
  })
  const { data: clockinSchedule } = useGetClockInSchedulesQuery()

  const { clockifyTimeEntriesQuery, misaClockInRecordsQuery, setClockifyTimeEntriesQuery, setMisaClockInRecordsQuery } =
    useCalendarStore()

  useEffect(() => {
    const firstDate = dates[0]
    const lastDate = dates[dates.length - 1]
    setClockifyTimeEntriesQuery({
      userId: settings.user ? settings.user.id : '',
      start: `${dayjs(firstDate).format('YYYY-MM-DDTHH:mm:ss')}Z`,
      end: `${dayjs(lastDate).add(1, 'day').subtract(1, 'second').format('YYYY-MM-DDTHH:mm:ss')}Z`,
      'page-size': 150,
    })

    setMisaClockInRecordsQuery({
      sessionId: clockinSchedule?.session_id,
      start: dayjs(firstDate).format('YYYY-MM-DD'),
      end: dayjs(lastDate).format('YYYY-MM-DD'),
    })
  }, [dates, settings.user, clockinSchedule])

  const { data: timeEntries, isLoading } = useGetClockifyTimeEntriesQuery(clockifyTimeEntriesQuery)

  const { data: misaTimeEntries, refetch: refetchClockInRecords } =
    useGetMisaClockInRecordsQuery(misaClockInRecordsQuery)

  const getTimeEntriesOfDate = useCallback(
    (d: Date) => {
      if (!timeEntries) return []

      return timeEntries.filter((timeEntry) => {
        return areTwoDatesEqual(timeEntry.timeInterval.start, d)
      })
    },
    [timeEntries],
  )

  const getMisaTimeEntriesOfDate = useCallback(
    (d: Date) => {
      if (!misaTimeEntries) return []
      const data = misaTimeEntries.Data.PageData
      return data.filter((item: any) => {
        return dayjs(item.CheckTime).isSame(d, 'day')
      })
    },
    [misaTimeEntries],
  )

  return (
    <Stack gap={16}>
      <Paper className={classes.calendarWrapper}>
        <Flex gap={6} mt={2} mb={8} justify="space-between" align="center" wrap="wrap">
          <Flex align="center" gap={8}>
            <Text fz={18} fw={500} c="white" pl={2}>
              <Text span fz={18} fw={800}>{MONTHS[month]}</Text> {year}
            </Text>
            {isLoading && <Loader size="xs" color="white" />}
          </Flex>
          <Flex gap={4} align="center">
            <Button ml={8} h={28} variant="light" onClick={jumpToToday} c="white">
              Today
            </Button>
            <ActionIcon variant="light" onClick={prevMonth}>
              <IconArrowLeft size={20} color="white" />
            </ActionIcon>
            <ActionIcon variant="light" onClick={nextMonth}>
              <IconArrowRight size={20} color="white" />
            </ActionIcon>
          </Flex>
        </Flex>

        <Box className={classes.calendar}>
          <Box className={classes.weekdays}>
            <Box>MO</Box>
            <Box>TU</Box>
            <Box>WE</Box>
            <Box>TH</Box>
            <Box>FR</Box>
            <Box c={'orange.5'}>SA</Box>
            <Box c={'orange.5'}>SU</Box>
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
  )
}
