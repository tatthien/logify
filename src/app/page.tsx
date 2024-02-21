"use client";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import classes from "./page.module.css";
import cx from "clsx";
import { Calendar } from "@/components/Calendar/Calendar";
import { Box, Container, Paper, Title } from "@mantine/core";
import { TokenForm } from "@/components/TokenForm/TokenForm";

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

function formatDate(date?: Date) {
  if (!date) return "";
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function formatDuration(duration: number) {
  if (duration < 60) return `${duration.toFixed(0)} secs`;

  const minutes = duration / 60;
  if (minutes < 60) return `${minutes.toFixed(0)} mins`;

  const hours = minutes / 60;
  return `${hours.toFixed(0)} hours`;
}

export default function Home() {
  const dateToday = new Date();

  const [month, setMonth] = useState(dateToday.getMonth());
  const [year, setYear] = useState(dateToday.getFullYear());
  const [timeEntries, setTimeEntries] = useState<any[]>([]);
  const [token, setToken] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

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

  const getTimeEntriesOfDate = useCallback(
    (d: Date) => {
      return timeEntries.filter((timeEntry) => {
        return isDateEqual(new Date(Number(timeEntry.start)), d);
      });
    },
    [timeEntries],
  );

  const selectedTimeEntries = useMemo(() => {
    if (!selectedDate) return [];
    return getTimeEntriesOfDate(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    const pk = localStorage.getItem("clickup_pk") || "";
    setToken(pk);
  }, []);

  useEffect(() => {
    if (token.trim() === "") return;

    const getTimeEntries = async () => {
      try {
        const params = new URLSearchParams();
        params.append("start_date", dates[0].getTime().toString());
        params.append("end_date", dates[dates.length - 1].getTime().toString());
        const res = await fetch(
          `https://api.clickup.com/api/v2/team/9018034579/time_entries?${params.toString()}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          },
        );
        const json = await res.json();
        setTimeEntries(json.data);
      } catch (err) {
        console.error(
          "Cannot get time entries, please check your personal token if it is correct",
        );
      }
    };

    getTimeEntries();
  }, [dates, token]);

  const isDateEqual = (d1: Date, d2: Date) => {
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  };

  return (
    <main>
      <Container py={40}>
        <Title mb={24} fz={32}>
          🤔 Have you logged ClickUp hours yet?
        </Title>

        <Paper withBorder shadow="md" p={16} mb={24}>
          <TokenForm />
        </Paper>

        <Calendar />
      </Container>
    </main>
  );
}
