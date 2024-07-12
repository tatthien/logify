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
import { IconLogout } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

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

  if (isCheckingAuth) {
    return (
      <Stack gap={16}>
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
    <AuthProvider value={{ user }}>
      <Box>
        <Group mb={16} justify="flex-end">
          <Text fw={500} fz="sm" c="dimmed">{`Hello, ${user?.email}`}</Text>
          <Menu width={180}>
            <Menu.Target>
              <ActionIcon
                variant="transparent"
                radius="xl"
                size={32}
                loading={isSigningOut}
                p={0}
              >
                <Avatar src={null} alt={user?.email} color="teal" radius="xl">
                  {user?.email?.charAt(0).toUpperCase()}
                </Avatar>
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                leftSection={<IconLogout size={18} />}
                onClick={handleLogout}
              >
                Log out
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
        {children}
      </Box>
    </AuthProvider>
  );
}
