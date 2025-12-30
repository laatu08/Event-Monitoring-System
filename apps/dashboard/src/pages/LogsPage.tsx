import { useEffect, useState } from "react";
import { fetchLogs } from "../api/logs";
import LogsTable from "../components/LogsTable";

type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";

export default function LogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [level, setLevel] = useState<LogLevel | undefined>(undefined);

  useEffect(() => {
    fetchLogs({ level }).then((data) => setLogs(data.logs));
  }, [level]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Logs</h1>

      <select
        value={level ?? ""}
        onChange={(e) =>
          setLevel(
            e.target.value === "" ? undefined : (e.target.value as LogLevel)
          )
        }
        className="border p-2 rounded mb-4"
      >
        <option value="">All</option>
        <option value="debug">Debug</option>
        <option value="info">Info</option>
        <option value="warn">Warn</option>
        <option value="error">Error</option>
        <option value="fatal">Fatal</option>
      </select>

      <LogsTable logs={logs} />
    </div>
  );
}
