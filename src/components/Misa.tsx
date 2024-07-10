"use client";

import { LOCAL_STORAGE_KEYS } from "@/constants";
import { Paper } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { MisaScheduleForm } from "./MisaScheduleForm";
import { CollapsibleCard } from "./CollapsibleCard";

export function Misa() {
  const [_, setId] = useLocalStorage({
    key: LOCAL_STORAGE_KEYS.MISA_SESSION_ID,
    defaultValue: "",
  });

  return (
    <CollapsibleCard title="Auto clock in" id="auto_clock_in_settings_card">
      <MisaScheduleForm onSubmit={(data) => setId(data.sessionId)} />
    </CollapsibleCard>
  );
}
