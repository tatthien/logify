import { client } from "./axios";

export type FetchTasksParams = {
  space_id: string;
  include_closed?: boolean;
};

export const fetchTasks = async ({
  space_id,
  include_closed,
}: FetchTasksParams) => {
  const res = await client.get(
    `team/9018034579/task?space_ids[]=${space_id}&include_closed=${include_closed}`,
  );
  return res.data;
};
