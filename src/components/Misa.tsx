"use client";

import { LOCAL_STORAGE_KEYS } from "@/constants";
import { useLocalStorage } from "@mantine/hooks";
import { MisaScheduleForm } from "./MisaScheduleForm";
import { CollapsibleCard } from "./CollapsibleCard";
import { IconFingerprint } from "@tabler/icons-react";
import { Text, getThemeColor } from "@mantine/core";

export function Misa() {
  const [_, setId] = useLocalStorage({
    key: LOCAL_STORAGE_KEYS.MISA_SESSION_ID,
    defaultValue: "",
  });

  return (
    <CollapsibleCard
      icon={
        <Text span fz={0} c="gray.5">
          <IconFingerprint stroke={1.5} color="currentColor" />
        </Text>
      }
      title="Auto clock in"
      id="auto_clock_in_settings_card"
    >
      <MisaScheduleForm onSubmit={(data) => setId(data.sessionId)} />
    </CollapsibleCard>
  );
}
