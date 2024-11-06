import { client } from './client'

export const fetchClockifyProjects = async () => {
  const res = await client.get('projects?archived=false')
  return res.data
}
