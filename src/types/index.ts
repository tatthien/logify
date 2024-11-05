// @TODO: Change case
//
export type Assignee = {
  id: string;
  color: string;
  initials: string;
  profilePicture: string;
  username: string;
};

export type Task = {
  id: string;
  name: string;
  status: {
    color: string;
    status: string;
  };
  assignees: Assignee[];
  task_location: {
    space_id: string;
  };
  url: string;
};

export type TimeEntry = {
  id: number;
  start: string;
  duration: string;
  task_url: string;
  task: Task;
};

export type Tag = {
  name: string;
  tag_bg: string;
  tag_fg: string;
};

export type CreateTimeEntry = {
  tid: string;
  duration: number;
  start: number;
  tags?: Tag[];
};

export type Space = {
  id: string;
  name: string;
  color: string;
  avatar?: string;
};

export type Form = {
  spaceId: string | null;
  start: Date;
  description: string;
  tagIds: string[];
  projectId: string | null;
} & Omit<CreateTimeEntry, "start">;

export type UpdateTimeEntryForm = {
  start: Date;
  description: string;
  tagIds: string[];
  projectId: string;
  duration: number;
};

export type ClockifyTag = {
  archived: boolean;
  id: string;
  name: string;
  workspaceId: string;
};

export type ClockifyProject = {
  archived: boolean;
  id: string;
  name: string;
  workspaceId: string;
  color: string;
};

export type ClockifyTimeInterval = {
  duration: string;
  end: string;
  start: string;
};

export type ClockifyTimeEntry = {
  id: string;
  description: string;
  projectId: string;
  tagIds: string[];
  timeInterval: ClockifyTimeInterval;
};

export type ClockifyUser = {
  id: string;
  name: string;
  profilePicture: string;
  activeWorkspace: string;
  defaultWorkspace: string;
};

export type AppSettings = {
  clickup?: string;
  clockify?: string;
  user?: ClockifyUser | null;
  workspaceId?: string;
  defaultTags?: string[];
};

export type Template = {
  id: string;
  name: string;
  value: {
    assigneeId: string;
    projectId: string;
    tagIds: string[];
    duration: number;
    description: string;
  };
}
