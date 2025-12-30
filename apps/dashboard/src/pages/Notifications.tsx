import { useEffect, useState } from "react";
import { fetchChannels } from "../api/notifications";
import { NotificationForm } from "../components/NotificationForm";
import { NotificationTable } from "../components/NotificationTable";

export default function Notifications() {
  const [channels, setChannels] = useState<any[]>([]);

  async function load() {
    const data = await fetchChannels();
    setChannels(data);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Notifications</h1>

      <NotificationForm onCreated={load} />
      <NotificationTable channels={channels} onChange={load} />
    </div>
  );
}
