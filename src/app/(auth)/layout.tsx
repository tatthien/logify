'use client'
import { useEffect, useMemo, useState } from 'react'
import { ActionIcon, Avatar, Box, Group, Menu, Paper, Skeleton, Stack, Text } from '@mantine/core'
import { useLocalStorage } from '@mantine/hooks'
import * as seline from '@seline-analytics/web'
import { User } from '@supabase/supabase-js'
import { IconFile, IconLogout, IconSettings, IconUser } from '@tabler/icons-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Logo } from '@/components/Logo'
import { LOCAL_STORAGE_KEYS } from '@/constants'
import { AuthProvider } from '@/providers/AuthProvider'
import { AppSettings } from '@/types'
import { supabase } from '@/utils/supabase/client'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [settings] = useLocalStorage<AppSettings>({
    key: LOCAL_STORAGE_KEYS.APP_SETTINGS,
  })

  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser(data.user)
        setIsCheckingAuth(false)

        seline.setUser({
          userId: data.user.id,
          email: data.user.email,
        })
      } else {
        router.push('/auth/sign-in')
      }
    })
  }, [])

  const handleLogout = async () => {
    setIsSigningOut(true)
    await supabase.auth.signOut()
    router.replace('/auth/sign-in')
    setIsSigningOut(false)
  }

  const userName = useMemo(() => {
    return user?.user_metadata?.name || user?.email
  }, [user])

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
    )
  }

  return (
    <AuthProvider value={{ user, setUser }}>
      <Box py={20}>
        <Paper py={8} px={8} mb={24} shadow="0" radius="md">
          <Group justify="space-between" align="center">
            <Link href="/" style={{ fontSize: 0 }}>
              <Logo />
            </Link>
            <Group gap={8} justify="flex-end">
              <Text fw={500} fz="sm" c="dimmed">
                <Text fz="xs" ta="right" lh={1} inherit>
                  {settings.user?.name}
                </Text>
                <Text fz="xs" ta="right" c="gray.5" inherit>
                  {settings.user?.email}
                </Text>
              </Text>
              <Menu width={180}>
                <Menu.Target>
                  <ActionIcon variant="transparent" radius="xl" size={38} loading={isSigningOut} p={0}>
                    <Avatar src={settings.user?.profilePicture} alt={userName} color="teal" radius={38}>
                      <IconUser size={18} />
                    </Avatar>
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item leftSection={<IconSettings size={18} />} onClick={() => router.push('/settings/api-keys')}>
                    Settings
                  </Menu.Item>
                  <Menu.Item leftSection={<IconFile size={18} />} onClick={() => router.push('/settings/templates')}>
                    Templates
                  </Menu.Item>
                  <Menu.Item leftSection={<IconUser size={18} />} onClick={() => router.push('/profile')}>
                    Profile
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item leftSection={<IconLogout size={18} />} onClick={handleLogout}>
                    Log out
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
          </Group>
        </Paper>
        {children}
      </Box>
    </AuthProvider>
  )
}
