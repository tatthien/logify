import { client } from './axios'

export const fetchSpaces = async () => {
  const res = await client.get(`team/${process.env.NEXT_PUBLIC_CLICKUP_TEAM_ID}/space?archived=false`)
  return res.data
}
