import { useEffect, useState } from "react";
import { fetchLogs } from "../api/logs";
import LogsTable from "../components/LogsTable";

type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";

const LEVEL_STYLES: Record<LogLevel, string> = {
  debug: "text-slate-500",
  info: "text-blue-600",
  warn: "text-yellow-600",
  error: "text-red-600",
  fatal: "text-red-800 font-semibold"
};

export default function LogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [level, setLevel] = useState<LogLevel | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  async function loadLogs() {
    setIsLoading(true);
    try {
      const data = await fetchLogs({ level });
      setLogs(data.logs);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadLogs();
  }, [level]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Logs Explorer</h1>

        <button
          onClick={loadLogs}
          className="text-sm border px-3 py-1.5 rounded hover:bg-slate-100"
        >
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded shadow p-4 flex items-center gap-4">
        <label className="text-sm text-slate-600">Level</label>

        <select
          value={level ?? ""}
          onChange={(e) =>
            setLevel(
              e.target.value === ""
                ? undefined
                : (e.target.value as LogLevel)
            )
          }
          className="border p-2 rounded"
        >
          <option value="">All</option>
          <option value="debug">Debug</option>
          <option value="info">Info</option>
          <option value="warn">Warn</option>
          <option value="error">Error</option>
          <option value="fatal">Fatal</option>
        </select>

        {level && (
          <span
            className={`ml-2 text-sm px-2 py-1 rounded bg-slate-100 ${
              LEVEL_STYLES[level]
            }`}
          >
            {level.toUpperCase()}
          </span>
        )}
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
      ) : logs.length === 0 ? (
        <div className="bg-white rounded shadow h-64 flex flex-col items-center justify-center text-center px-6">
          <h2 className="text-lg font-semibold text-slate-700">
            No logs found
          </h2>
          <p className="text-slate-500 mt-2 max-w-md">
            Try changing the log level filter or check back later
            when new logs are ingested.
          </p>
        </div>
      ) : (
        <LogsTable logs={logs} />
      )}
    </div>
  );
}
