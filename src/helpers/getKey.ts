import { readLocalStorageValue } from '@mantine/hooks'

import { DEFAULT_APP_SETTINGS, LOCAL_STORAGE_KEYS } from '@/constants'
import { AppSettings } from '@/types'

export function getSettings(key: keyof AppSettings) {
  const settings = readLocalStorageValue({
    key: LOCAL_STORAGE_KEYS.APP_SETTINGS,
    defaultValue: DEFAULT_APP_SETTINGS,
  })

  return settings[key]
}
