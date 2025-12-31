import { useState } from "react";
import {
  acknowledgeIncident,
  resolveIncident
} from "../api/incidents";

type IncidentStatus = "open" | "acknowledged" | "resolved";

type Incident = {
  id: string;
  service: string;
  errorCount: number;
  windowMinutes: number;
  triggeredAt: string;
  status: IncidentStatus;
};

function StatusBadge({ status }: { status: IncidentStatus }) {
  const styles = {
    open: "bg-red-100 text-red-700",
    acknowledged: "bg-yellow-100 text-yellow-700",
    resolved: "bg-green-100 text-green-700"
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}
    >
      {status.toUpperCase()}
    </span>
  );
}

export function IncidentTable({
  incidents,
  onChange
}: {
  incidents: Incident[];
  onChange: () => void;
}) {
  const [loading, setLoading] = useState<{
    id: string;
    action: "ack" | "resolve";
  } | null>(null);

  async function handleAcknowledge(id: string) {
    try {
      setLoading({ id, action: "ack" });
      await acknowledgeIncident(id);
      await onChange();
    } finally {
      setLoading(null);
    }
  }

  async function handleResolve(id: string) {
    try {
      setLoading({ id, action: "resolve" });
      await resolveIncident(id);
      await onChange();
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
      <table className="w-full text-sm text-center">
        <thead>
          <tr className="bg-slate-100 text-slate-700">
            <th className="px-4 py-3 font-semibold">Time</th>
            <th className="px-4 py-3 font-semibold">Service</th>
            <th className="px-4 py-3 font-semibold">Errors</th>
            <th className="px-4 py-3 font-semibold">Window</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold">Action</th>
          </tr>
        </thead>

        <tbody>
          {incidents.map((i) => {
            const isRowLoading = loading?.id === i.id;

            return (
              <tr
                key={i.id}
                className={`border-t transition ${
                  isRowLoading ? "opacity-60" : "hover:bg-slate-50"
                }`}
              >
                <td className="px-4 py-3 font-mono text-slate-600">
                  {new Date(i.triggeredAt).toLocaleString()}
                </td>

                <td className="px-4 py-3 font-medium text-slate-700">
                  {i.service}
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded text-sm font-semibold ${
                      i.errorCount >= 10
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {i.errorCount}
                  </span>
                </td>

                <td className="px-4 py-3 text-slate-700">
                  {i.windowMinutes} min
                </td>

                <td className="px-4 py-3">
                  <StatusBadge status={i.status} />
                </td>

                <td className="px-4 py-3 space-x-2">
                  {i.status === "open" && (
                    <button
                      disabled={isRowLoading}
                      onClick={() => handleAcknowledge(i.id)}
                      className={`px-3 py-1 rounded text-xs text-white ${
                        isRowLoading
                          ? "bg-yellow-300 cursor-not-allowed"
                          : "bg-yellow-500 hover:bg-yellow-600"
                      }`}
                    >
                      {isRowLoading ? "Working…" : "Acknowledge"}
                    </button>
                  )}

                  {i.status === "acknowledged" && (
                    <button
                      disabled={isRowLoading}
                      onClick={() => handleResolve(i.id)}
                      className={`px-3 py-1 rounded text-xs text-white ${
                        isRowLoading
                          ? "bg-green-300 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {isRowLoading ? "Working…" : "Resolve"}
                    </button>
                  )}

                  {i.status === "resolved" && (
                    <span className="text-slate-400 text-xs">—</span>
                  )}
                </td>
              </tr>
            );
          })}

          {incidents.length === 0 && (
            <tr>
              <td
                colSpan={6}
                className="px-6 py-12 text-center text-slate-500"
              >
                No incidents recorded
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
