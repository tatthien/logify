import { CollapsibleCard } from "@/components/CollapsibleCard";
import { DefaultTimeEntrySettingsForm } from "@/components/DefaultTimeEntrySettingsForm";
import { Text } from "@mantine/core";
import { IconClockPlus } from "@tabler/icons-react";

export default function Page() {
  return (
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
  );
}
