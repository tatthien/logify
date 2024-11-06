export type Space = {
  id: string
  name: string
  color: string
  avatar?: string
}

export type UpdateTimeEntryForm = {
  start: Date
  description: string
  tagIds: string[]
  projectId: string
  duration: number
}

export type ClockifyTag = {
  archived: boolean
  id: string
  name: string
  workspaceId: string
}

export type ClockifyProject = {
  archived: boolean
  id: string
  name: string
  workspaceId: string
  color: string
}

export type ClockifyTimeInterval = {
  duration: string
  end: string
  start: string
}

export type ClockifyTimeEntry = {
  id: string
  description: string
  projectId: string
  tagIds: string[]
  timeInterval: ClockifyTimeInterval
}

export type ClockifyUser = {
  id: string
  name: string
  profilePicture: string
  activeWorkspace: string
  defaultWorkspace: string
}

export type AppSettings = {
  clockify?: string
  user?: ClockifyUser | null
  workspaceId?: string
  defaultTags?: string[]
}

export type Template = {
  id: string
  name: string
  value: {
    assigneeId: string
    projectId: string
    tagIds: string[]
    duration: number
    description: string
  }
}
