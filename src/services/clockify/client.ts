import { getSettings } from "@/helpers/getKey";
import axios from "axios";

export const client = axios.create({
  baseURL: "https://api.clockify.me/api/v1/",
});

client.interceptors.request.use(
  (config) => {
    config.baseURL += `/workspaces/${getSettings("workspaceId")}`;
    const apiKey = getSettings("clockify");
    config.headers["X-API-Key"] = apiKey;
    return config;
  },
  (err) => {
    Promise.reject(err);
  },
);
