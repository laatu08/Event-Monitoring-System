import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api"
});

export async function fetchIncidents() {
  const res = await api.get("/alerts/incidents");
  return res.data;
}

export async function acknowledgeIncident(id: string) {
  await api.post(`/alerts/incidents/${id}/acknowledge`);
}

export async function resolveIncident(id: string) {
  await api.post(`/alerts/incidents/${id}/resolve`);
}