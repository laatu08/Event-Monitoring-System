import { useEffect, useState } from "react";
import { fetchIncidents } from "../api/incidents";
import { IncidentTable } from "../components/IncidentTable";

export default function Incidents() {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  async function loadIncidents() {
    setIsLoading(true);
    try {
      const data = await fetchIncidents();
      setIncidents(data);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadIncidents();
  }, []);

  const total = incidents.length;
  const critical = incidents.filter((i) => i.errorCount >= 10).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Incidents</h1>

        <button
          onClick={loadIncidents}
          className="text-sm border px-3 py-1.5 rounded hover:bg-slate-100"
        >
          Refresh
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard label="Total Incidents" value={total} />
        <SummaryCard
          label="Critical (≥10 errors)"
          value={critical}
          highlight
        />
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="bg-white rounded shadow p-6">
          <div className="animate-pulse space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-4 bg-slate-200 rounded w-full"
              />
            ))}
          </div>
        </div>
      ) : incidents.length === 0 ? (
        <div className="bg-white rounded shadow h-64 flex flex-col items-center justify-center text-center px-6">
          <h2 className="text-lg font-semibold text-slate-700">
            No incidents recorded
          </h2>
          <p className="text-slate-500 mt-2 max-w-md">
            When alert rules trigger, incidents will appear here
            for investigation and auditing.
          </p>
        </div>
      ) : (
        <IncidentTable incidents={incidents} />
      )}
    </div>
  );
}

/* -------- Small helper component -------- */

function SummaryCard({
  label,
  value,
  highlight
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`bg-white rounded shadow p-4 ${
        highlight ? "border-l-4 border-red-500" : ""
      }`}
    >
      <div className="text-sm text-slate-500">{label}</div>
      <div
        className={`text-2xl font-semibold ${
          highlight ? "text-red-600" : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}
