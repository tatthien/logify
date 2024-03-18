import { CreateTimeEntry } from "@/types";
import { client } from "./axios";

export const fetchTimeEntries = async (params = {}) => {
  const res = await client.get("team/9018034579/time_entries", { params });
  return res.data.data;
};

export const createTimeEntry = async (body: CreateTimeEntry) => {
  const query = new URLSearchParams({
    custom_task_ids: "true",
    team_id: "9018034579", // @TODO: move team id value to env
  }).toString();
  const res = await client.post(`team/9018034579/time_entries?${query}`, body);
  return res.data.data;
};

export const deleteTimeEntry = async (timeId: number) => {
  const res = await client.delete(`team/9018034579/time_entries/${timeId}`);
  return res.data.data;
};
