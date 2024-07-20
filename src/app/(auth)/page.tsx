"use client";
import { Calendar } from "@/components/Calendar/Calendar";
import { Stack } from "@mantine/core";

export default function Home() {
  return (
    <Stack gap={12} component="main">
      <Calendar />
    </Stack>
  );
}
