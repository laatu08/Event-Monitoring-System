import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api"
});

export async function fetchAlertRules() {
  const res = await api.get("/alerts/rules");
  return res.data;
}

export async function createAlertRule(data: {
  service: string;
  threshold: number;
  windowMinutes: number;
  cooldownMinutes: number;
}) {
  const res = await api.post("/alerts/rules", data);
  return res.data;
}

export async function toggleAlertRule(id: string, enabled: boolean) {
  await api.patch(`/alerts/rules/${id}`, { enabled });
}

export async function deleteAlertRule(id: string) {
  await api.delete(`/alerts/rules/${id}`);
}
