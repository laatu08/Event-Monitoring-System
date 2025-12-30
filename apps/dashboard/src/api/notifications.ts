import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api"
});

export async function fetchChannels() {
  const res = await api.get("/alerts/channels");
  return res.data;
}

export async function createChannel(data: {
  type: string;
  target: string;
}) {
  const res = await api.post("/alerts/channels", data);
  return res.data;
}

export async function toggleChannel(id: string, enabled: boolean) {
  await api.patch(`/alerts/channels/${id}`, { enabled });
}
