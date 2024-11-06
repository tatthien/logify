import axios from 'axios'

import { getSettings } from '@/helpers/getKey'

export const client = axios.create({
  baseURL: 'https://api.clickup.com/api/v2/',
})

client.interceptors.request.use(
  (config) => {
    const token = getSettings('clickup')
    config.headers.Authorization = token as string
    return config
  },
  (err) => {
    Promise.reject(err)
  },
)
