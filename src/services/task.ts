import { client } from "./axios";

export type FetchTasksParams = {
  space_id: string | null;
  include_closed?: boolean;
  assignees?: string[];
};

export const fetchTasks = async ({
  space_id,
  include_closed,
  assignees,
}: FetchTasksParams) => {
  const assigneesQuery = new URLSearchParams(
    (assignees || []).map((a) => ["assignees[]", a]),
  );

  const res = await client.get(
    `team/${process.env.NEXT_PUBLIC_CLICKUP_TEAM_ID}/task?space_ids[]=${space_id}&include_closed=${include_closed}&${assigneesQuery.toString()}`,
  );
  return res.data;
};
