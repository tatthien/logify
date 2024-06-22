import { client } from "./client";

export type CreateCustomAttributePayload = {
  name: string;
  namespace: string;
  value: string;
};

export type CreateClockifyTimeEntryPayload = {
  description?: string;
  tagIds?: string[];
  projectId: string;
  start: string;
  end: string;
  customAttributes?: CreateCustomAttributePayload[];
};

export type FetchClockifyTimeEntryParams = {
  userId: string;
  start: string;
  end: string;
};

export const fetchClockifyTimeEntries = async (
  params: FetchClockifyTimeEntryParams,
) => {
  const res = await client.get(
    `user/${params.userId}/time-entries?start=${params.start}&end=${params.end}`,
  );
  return res.data;
};

export const createClockifyTimeEntry = async (
  payload: CreateClockifyTimeEntryPayload,
) => {
  const res = await client.post("time-entries", payload);
  return res.data;
};

export const deleteClockifyTimeEntry = async (timeId: string) => {
  const res = await client.delete(`time-entries/${timeId}`);
  return res.data.data;
};
