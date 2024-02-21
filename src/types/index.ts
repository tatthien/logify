export type Task = {
  id: string;
  name: string;
  status: {
    color: string;
    status: string;
  };
};

export type TimeEntry = {
  id: string;
  start: string;
  duration: string;
  task_url: string;
  task: Task;
};
