"use client";

import { Box, Button, Checkbox, Flex, Text } from "@mantine/core";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import classes from "./MisaScheduleCalendar.module.css";

type MisaScheduleCalendarProps = {
  value: string[];
  onChange?: (value: string[]) => void;
};

export function MisaScheduleCalendar({
  value,
  onChange,
}: MisaScheduleCalendarProps) {
  const [localValue, setLocalValue] = useState<string[]>([]);
  const today = new Date();
  const month = today.getMonth();
  const year = today.getFullYear();

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const dates = useMemo<Date[]>(() => {
    const localDates: Date[] = [];
    const lastDate = new Date(year, month + 1, 0).getDate();

    for (let i = 1; i <= lastDate; i++) {
      localDates.push(new Date(year, month, i));
    }

    return localDates.filter((d) => d.getDay() !== 6 && d.getDay() !== 0);
  }, [month, year]);

  const toggleSelect = () => {
    if (localValue.length === dates.length) {
      setLocalValue([]);
      handleChange([]);
    } else {
      const d = dates.map((d) => dayjs(d).format("YYYY-MM-DD"));
      setLocalValue(d);
      handleChange(d);
    }
  };

  const handleChange = (value: string[]) => {
    setLocalValue(value);
    if (onChange) onChange(value);
  };

  return (
    <Box className={classes.calendarWrapper}>
      <Flex mb={16} align="center" justify="space-between">
        <Text fw={600} span>
          {dayjs().format("MMM YYYY")}
        </Text>
        <Button
          variant="default"
          size="compact-md"
          fz={"xs"}
          fw={500}
          onClick={toggleSelect}
        >
          {localValue.length === dates.length ? "Deselect all" : "Select all"}
        </Button>
      </Flex>
      <Box className={classes.calendarHeader}>
        <Text span>M</Text>
        <Text span>T</Text>
        <Text span>W</Text>
        <Text span>T</Text>
        <Text span>F</Text>
      </Box>
      <Checkbox.Group
        className="schedule-calendar"
        value={localValue}
        onChange={(value) => handleChange(value)}
      >
        {dates.map((d, i) => (
          <Checkbox.Card
            className={classes.checkboxCardRoot}
            key={i}
            value={dayjs(d).format("YYYY-MM-DD")}
          >
            <Text fz="xs" fw={500}>
              {dayjs(d).format("DD-MM")}
            </Text>
          </Checkbox.Card>
        ))}
      </Checkbox.Group>
    </Box>
  );
}
