import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api"
});



type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";

export async function fetchLogs(params: {
  service?: string;
  level?: LogLevel;
  page?: number;
  limit?: number;
}) {
  const res = await api.get("/logs", { params });
  return res.data;
}
