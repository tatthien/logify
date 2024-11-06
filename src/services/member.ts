import { Assignee } from '@/types'

import { client } from './axios'

export const fetctMembers = async (): Promise<{ user: Assignee }[]> => {
  const res = await client.get('team')
  const team = res.data.teams.find((team: any) => team.id === process.env.NEXT_PUBLIC_CLICKUP_TEAM_ID)
  return team.members
}
