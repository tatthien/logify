import { SettingsNav } from "@/components/SettingsNav";
import { Box } from "@mantine/core";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box pos="relative">
      {children}
      <SettingsNav />
    </Box>
  );
}
