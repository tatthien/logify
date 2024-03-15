import { client } from "./axios";

export const fetchTags = async (spaceId: string) => {
  const res = await client.get(`space/${spaceId}/tag`);
  return res.data;
};
