import { useEffect, useState } from "react";
import { fetchChannels } from "../api/notifications";
import { NotificationForm } from "../components/NotificationForm";
import { NotificationTable } from "../components/NotificationTable";

export default function Notifications() {
  const [channels, setChannels] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  async function load() {
    setIsLoading(true);
    try {
      const data = await fetchChannels();
      setChannels(data);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const total = channels.length;
  const enabled = channels.filter((c) => c.enabled).length;
  const disabled = total - enabled;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Notification Channels</h1>

        <button
          onClick={load}
          className="text-sm border px-3 py-1.5 rounded hover:bg-slate-100"
        >
          Refresh
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard label="Total Channels" value={total} />
        <SummaryCard
          label="Enabled"
          value={enabled}
          highlight="green"
        />
        <SummaryCard
          label="Disabled"
          value={disabled}
          highlight="yellow"
        />
      </div>

      {/* Create Channel */}
      <div className="bg-white rounded shadow p-4">
        <h2 className="text-lg font-semibold mb-2">
          Add Notification Channel
        </h2>
        <NotificationForm onCreated={load} />
      </div>

      {/* Channels List */}
      {isLoading ? (
        <div className="bg-white rounded shadow p-6">
          <Skeleton />
        </div>
      ) : channels.length === 0 ? (
        <div className="bg-white rounded shadow h-64 flex flex-col items-center justify-center text-center px-6">
          <h2 className="text-lg font-semibold text-slate-700">
            No notification channels configured
          </h2>
          <p className="text-slate-500 mt-2 max-w-md">
            Add channels like Email, Slack, or Webhooks so alert
            rules know where to send notifications.
          </p>
        </div>
      ) : (
        <NotificationTable
          channels={channels}
          onChange={load}
        />
      )}
    </div>
  );
}

/* ---------- Helpers ---------- */

function SummaryCard({
  label,
  value,
  highlight
}: {
  label: string;
  value: number;
  highlight?: "green" | "yellow";
}) {
  const color =
    highlight === "green"
      ? "text-green-600 border-green-500"
      : highlight === "yellow"
      ? "text-yellow-600 border-yellow-500"
      : "text-slate-700";

  return (
    <div
      className={`bg-white rounded shadow p-4 border-l-4 ${color}`}
    >
      <div className="text-sm text-slate-500">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-slate-200 rounded w-full"
        />
      ))}
    </div>
  );
}
