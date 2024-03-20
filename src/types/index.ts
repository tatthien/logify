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
  spaceId: string;
  start: Date;
} & Omit<CreateTimeEntry, "start">;
