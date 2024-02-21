import axios from "axios";

export const client = axios.create({
  baseURL: "https://api.clickup.com/api/v2/team/9018034579/",
});

client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("clickup_pk") ?? "";
    config.headers.Authorization = JSON.parse(token);
    return config;
  },
  (err) => {
    Promise.reject(err);
  },
);
