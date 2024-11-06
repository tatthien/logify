'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Anchor, Button, Flex, FocusTrap, PasswordInput, Stack } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useLocalStorage } from '@mantine/hooks'

import { DEFAULT_APP_SETTINGS, LOCAL_STORAGE_KEYS } from '@/constants'
import { AppSettings, ClockifyUser } from '@/types'

const fetchCurrentUser = async (apiKey: string): Promise<ClockifyUser> => {
  const res = await fetch('https://api.clockify.me/api/v1/user', {
    headers: {
      'X-API-Key': apiKey,
    },
  })
  const data = await res.json()
  if (res.ok) return data
  throw data
}

export function SettingsForm() {
  const [isFetchingUser, setIsFetchingUser] = useState(false)

  const [settings, setSettings] = useLocalStorage<AppSettings>({
    key: LOCAL_STORAGE_KEYS.APP_SETTINGS,
    defaultValue: DEFAULT_APP_SETTINGS,
  })

  const form = useForm({
    initialValues: {
      clockify: settings.clockify,
    },
  })

  useEffect(() => {
    form.setValues({
      clockify: settings.clockify,
    })
  }, [settings])

  const handleSubmit = async (values: any) => {
    try {
      setIsFetchingUser(true)

      // Fetching current Clockify user
      const user = await fetchCurrentUser(values.clockify)

      setSettings({
        clockify: values.clockify,
        user: {
          id: user.id,
          name: user.name,
          profilePicture: user.profilePicture,
          activeWorkspace: user.activeWorkspace,
          defaultWorkspace: user.defaultWorkspace,
        },
        workspaceId: user.activeWorkspace,
      })

      toast.success('Settings saved')
    } catch (err: any) {
      if (err.code && err.code === 4003) {
        toast.error('Clockify API key is invalid')
      } else {
        toast.error('Failed to save settings')
      }
    } finally {
      setIsFetchingUser(false)
    }
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap={8}>
        <FocusTrap active={true}>
          <PasswordInput
            label="Clockify API key"
            style={{ flex: 1 }}
            placeholder="Enter your Clockify API key here"
            {...form.getInputProps('clockify')}
          />
        </FocusTrap>
        <Anchor fz={12} href="/how-to-get-token.webp" target="_blank">
          How to retrieve your Clockify API key?
        </Anchor>
      </Stack>
      <Flex justify="flex-start" align="center" mt={16} gap={8}>
        <Button type="submit" loading={isFetchingUser} disabled={isFetchingUser}>
          Save
        </Button>
      </Flex>
    </form>
  )
}
