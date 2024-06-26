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
  "page-size"?: number;
};

export const fetchClockifyTimeEntries = async (
  params: FetchClockifyTimeEntryParams,
) => {
  const query = new URLSearchParams({
    start: params.start,
    end: params.end,
    userId: params.userId,
    "page-size": params["page-size"] ? params["page-size"].toString() : "50",
  }).toString();

  const res = await client.get(`user/${params.userId}/time-entries?${query}`);
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
