declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_BASE_URL: string
      NEXT_PUBLIC_SUPABASE_URL: string
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string
      NEXT_PUBLIC_CLICKUP_TEAM_ID: string
      SST_SUPABASE_URL: string
      SST_SUPABASE_ANON_KEY: string
      SST_SUPABASE_SERVICE_ROLE_KEY: string
    }
  }
}

export {}
