import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api"
});

export async function fetchErrorMetrics(params: {
  service: string;
  range: string;
}) {
  const res = await api.get("/metrics/errors", { params });
  return res.data; // [{ time, count }]
}
