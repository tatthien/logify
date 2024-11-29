import { useMemo } from 'react'
import { Select } from '@mantine/core'
import { useLocalStorage } from '@mantine/hooks'

import { DEFAULT_APP_SETTINGS, LOCAL_STORAGE_KEYS } from '@/constants'
import { AppSettings } from '@/types'

import classes from './ActiveWorkspaceSelect.module.css'

export function ActiveWorkspaceSelect({ onChange }: { onChange?: (value: string | null) => void }) {
  const [settings, setSettings] = useLocalStorage<AppSettings>({
    key: LOCAL_STORAGE_KEYS.APP_SETTINGS,
    defaultValue: DEFAULT_APP_SETTINGS,
  })

  const data = useMemo(() => {
    if (!settings || !settings.workspaces) return []

    return settings.workspaces.map((w) => ({
      label: w.name,
      value: w.id,
    }))
  }, [settings])

  const handleSelect = (value: string | null) => {
    if (!value) return

    setSettings({
      ...settings,
      workspaceId: value,
    })

    onChange?.(value)
  }

  return (
    <Select
      data={data}
      value={settings.workspaceId}
      placeholder="Select workspace"
      size="xs"
      height={28}
      clearable={false}
      classNames={{
        wrapper: classes.wrapper,
        root: classes.root,
        input: classes.input,
      }}
      onChange={handleSelect}
    />
  )
}
