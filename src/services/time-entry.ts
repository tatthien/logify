import { client } from "./axios";

export const fetchTimeEntries = async (params = {}) => {
  const res = await client.get("time_entries", { params });
  return res.data.data;
};
