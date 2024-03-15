import { client } from "./axios";

export const fetchTasks = async (spaceId: string) => {
  const res = await client.get(`team/9018034579/task?space_ids[]=${spaceId}`);
  return res.data;
};
