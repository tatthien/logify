import { AppSettings } from '@/types'

export const LOCAL_STORAGE_KEYS = {
  APP_SETTINGS: '_w3tech_tracking_app_settings',
  MISA_SESSION_ID: '_w3tech_tracking_misa_session_id',
  TOKEN_FORM_COLLAPSED: '_w3tech_tracking_app_token_form_collapsed',
}

export const DEFAULT_APP_SETTINGS: AppSettings = {
  clockify: '',
  user: null,
  workspaceId: '',
  defaultTags: [],
}
