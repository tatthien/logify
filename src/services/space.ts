import { client } from "./axios";

export const fetchSpaces = async () => {
  const res = await client.get("team/9018034579/space?archived=false");
  return res.data;
};
