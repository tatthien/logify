import { ChangePasswordForm } from "@/components/ChangePasswordForm";
import { CollapsibleCard } from "@/components/CollapsibleCard";
import { DeleteAccountCard } from "@/components/DeleteAccountCard";
import { UpdateProfileForm } from "@/components/UpdateProfileForm";
import { Stack, Text } from "@mantine/core";
import { IconLock, IconUserEdit } from "@tabler/icons-react";

export default function Page() {
  return (
    <Stack gap={12} component="main">
      <CollapsibleCard
        icon={
          <Text span fz={0} c="gray.5">
            <IconUserEdit stroke={1.5} color="currentColor" />
          </Text>
        }
        title="Profile"
        id="profile_settings_card"
      >
        <UpdateProfileForm />
      </CollapsibleCard>
      <CollapsibleCard
        icon={
          <Text span fz={0} c="gray.5">
            <IconLock stroke={1.5} color="currentColor" />
          </Text>
        }
        title="Password"
        id="password_settings_card"
      >
        <ChangePasswordForm />
      </CollapsibleCard>
      <DeleteAccountCard />
    </Stack>
  );
}
