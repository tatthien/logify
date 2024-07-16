import { Misa } from "@/components/Misa";
import { SettingsForm } from "@/components/SettingsForm";
import { Stack } from "@mantine/core";

export default function Page() {
  return (
    <Stack gap={12} component="main">
      <SettingsForm />
      <Misa />
    </Stack>
  );
}
