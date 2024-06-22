import { getSettings } from "@/helpers/getKey";
import axios from "axios";

export const client = axios.create({
  baseURL: "https://api.clickup.com/api/v2/",
});

client.interceptors.request.use(
  (config) => {
    const key = getSettings("clickup");
    config.headers.Authorization = key;
    return config;
  },
  (err) => {
    Promise.reject(err);
  },
);
