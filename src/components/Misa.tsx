"use client";

import { LOCAL_STORAGE_KEYS } from "@/constants";
import { Paper } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { MisaScheduleForm } from "./MisaScheduleForm";

export function Misa() {
  const [_, setId] = useLocalStorage({
    key: LOCAL_STORAGE_KEYS.MISA_SESSION_ID,
    defaultValue: "",
  });

  return (
    <Paper mb={24} p={16}>
      <MisaScheduleForm onSubmit={(data) => setId(data.sessionId)} />
    </Paper>
  );
}
