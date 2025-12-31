import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api"
});

export async function fetchServices(): Promise<string[]> {
  const res = await api.get("/alerts/services");
  return res.data;
}
