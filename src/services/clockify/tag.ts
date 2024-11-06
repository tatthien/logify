import { client } from './client'

export const fetchClockifyTags = async () => {
  const res = await client.get('tags?archived=false')
  return res.data
}
