"use client";
import { AuthProvider } from "@/providers/AuthProvider";
import { supabase } from "@/utils/supabase/client";
import {
  Skeleton,
  Stack,
  Box,
  Text,
  Menu,
  Avatar,
  ActionIcon,
  Group,
} from "@mantine/core";
import { User } from "@supabase/supabase-js";
import {
  IconClockPlus,
  IconHome2,
  IconLogout,
  IconSettings,
  IconUser,
} from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser(data.user);
        setIsCheckingAuth(false);
      } else {
        router.push("/auth/sign-in");
      }
    });
  }, []);

  const handleLogout = async () => {
    setIsSigningOut(true);
    await supabase.auth.signOut();
    router.replace("/auth/sign-in");
    setIsSigningOut(false);
  };

  const userName = useMemo(() => {
    return user?.user_metadata?.name || user?.email;
  }, [user]);

  if (isCheckingAuth) {
    return (
      <Stack py={20} gap={16}>
        <Group justify="flex-end">
          <Skeleton height={10} width={200} radius="sm" />
          <Skeleton height={32} circle />
        </Group>
        <Skeleton height={80} radius="sm" />
        <Skeleton height={60} radius="sm" />
        <Skeleton height={200} radius="sm" />
      </Stack>
    );
  }

  return (
    <AuthProvider value={{ user, setUser }}>
      <Box py={20}>
        <Group mb={16} justify="space-between" align="center">
          <ActionIcon variant="light" component={Link} href={"/"}>
            <IconHome2 size={20} />
          </ActionIcon>
          <Group gap={8} justify="flex-end">
            <Text fw={500} fz="sm" c="dimmed">
              {userName}
            </Text>
            <Menu width={180}>
              <Menu.Target>
                <ActionIcon
                  variant="transparent"
                  radius="xl"
                  size={32}
                  loading={isSigningOut}
                  p={0}
                >
                  <Avatar src={null} alt={userName} color="teal" radius="xl">
                    <IconUser size={18} />
                  </Avatar>
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  leftSection={<IconUser size={18} />}
                  onClick={() => router.push("/profile")}
                >
                  Profile
                </Menu.Item>
                <Menu.Item
                  leftSection={<IconSettings size={18} />}
                  onClick={() => router.push("/settings")}
                >
                  Settings
                </Menu.Item>
                <Menu.Item
                  leftSection={<IconClockPlus size={18} />}
                  onClick={() => router.push("/logtime")}
                >
                  Log time
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  leftSection={<IconLogout size={18} />}
                  onClick={handleLogout}
                >
                  Log out
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
        {children}
      </Box>
    </AuthProvider>
  );
}
