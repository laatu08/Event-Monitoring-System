import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api"
});

export async function fetchLogs(params: {
  service?: string;
  level?: string;
  page?: number;
  limit?: number;
}) {
  const res = await api.get("/logs", { params });
  return res.data;
}
