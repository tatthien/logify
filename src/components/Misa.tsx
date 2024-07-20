"use client";

import { LOCAL_STORAGE_KEYS } from "@/constants";
import { useLocalStorage } from "@mantine/hooks";
import { MisaScheduleForm } from "./MisaScheduleForm";

export function Misa() {
  const [_, setId] = useLocalStorage({
    key: LOCAL_STORAGE_KEYS.MISA_SESSION_ID,
    defaultValue: "",
  });

  return <MisaScheduleForm onSubmit={(data) => setId(data.sessionId)} />;
}
