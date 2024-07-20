import { CollapsibleCard } from "@/components/CollapsibleCard";
import { DefaultTimeEntrySettingsForm } from "@/components/DefaultTimeEntrySettingsForm";
import { Misa } from "@/components/Misa";
import { SettingsForm } from "@/components/SettingsForm";
import { Stack, Text } from "@mantine/core";
import {
  IconClockPlus,
  IconFingerprint,
  IconSettings,
} from "@tabler/icons-react";

export default function Page() {
  return (
    <Stack gap={12} component="main">
      <CollapsibleCard
        icon={
          <Text span fz={0} c="gray.5">
            <IconSettings stroke={1.5} color="currentColor" />
          </Text>
        }
        title="API keys"
      >
        <SettingsForm />
      </CollapsibleCard>
      <CollapsibleCard
        icon={
          <Text span fz={0} c="gray.5">
            <IconFingerprint stroke={1.5} color="currentColor" />
          </Text>
        }
        title="Misa"
      >
        <Misa />
      </CollapsibleCard>
      <CollapsibleCard
        icon={
          <Text span fz={0} c="gray.5">
            <IconClockPlus stroke={1.5} color="currentColor" />
          </Text>
        }
        title="Default form values"
      >
        <DefaultTimeEntrySettingsForm />
      </CollapsibleCard>
    </Stack>
  );
}
