import { useMemo } from 'react'
import { Box, Flex, Group, Text, Tooltip } from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons-react'
import cx from 'clsx'

import { getDurationClockifyFromTimeEntry } from '@/helpers/getDurationFromClockifyTimeEntry'
import { ClockifyTimeEntry } from '@/types'
import { areTwoDatesEqual } from '@/utils/areTwoDatesEqual'

import classes from './Calendar.module.scss'

type CalendarDateProps = {
  date: Date
  selectedDate: Date | undefined
  month: number
  misaTimeEntries: any[]
  clockifyTimeEntries: ClockifyTimeEntry[]
  onSelect?: (date: Date) => void
}

export function CalendarDate({
  date,
  selectedDate,
  month,
  misaTimeEntries,
  clockifyTimeEntries,
  onSelect,
}: CalendarDateProps) {
  const today = useMemo(() => new Date(), [])

  const isWeekend = useMemo(() => {
    return date.getDay() === 6 || date.getDay() === 0
  }, [date])

  const dateClasses = useMemo(() => {
    return cx(
      classes.date, // base class
      areTwoDatesEqual(date, today) && classes.today, // today class
      date.getMonth() !== month && classes.inactive, // inactive date class
      selectedDate && areTwoDatesEqual(date, selectedDate) && classes.selected, // selected date class
      isWeekend && classes.weekend, // weekend class
    )
  }, [date, selectedDate, month, today, isWeekend])

  const totalWorkingHours = useMemo(() => {
    const totalSeconds =
      clockifyTimeEntries.reduce((acc, curr) => {
        return acc + getDurationClockifyFromTimeEntry(curr)
      }, 0) / 1000

    return totalSeconds / 3600
  }, [clockifyTimeEntries])

  return (
    <a
      href="#"
      onClick={(event) => {
        event.preventDefault()
        if (onSelect) {
          onSelect(date)
        }
      }}
      className={dateClasses}
    >
      <Box className={classes.inner}>
        <Text component="span" className={classes.dateNumber}>
          {date.getDate()}
        </Text>
        <Flex align="center" justify="center" gap={2}>
          <Group gap={4} mih={8}>
            {clockifyTimeEntries.length > 0 && (
              <Box
                aria-label="time tracked indicator"
                className={cx(classes.timeTrackedIndicator, classes.timeTrackedIndicatorActive)}
              ></Box>
            )}

            {misaTimeEntries.length > 0 && (
              <Box
                aria-label="misa clock in indicator"
                className={cx(classes.timeTrackedIndicator, classes.misaClockInIndicatorActive)}
              ></Box>
            )}
          </Group>

          {clockifyTimeEntries.length > 0 &&
            // Show the alert when the total hour is less than 8
            totalWorkingHours < 8 && (
              <Tooltip label="< 8 hours">
                <Text
                  c="orange.7"
                  fz={0}
                  style={{
                    position: 'absolute',
                    top: '0.375rem',
                    right: '0.375rem',
                  }}
                >
                  <IconAlertCircle size={14} strokeWidth={2.5} />
                </Text>
              </Tooltip>
            )}
        </Flex>
      </Box>
    </a>
  )
}
