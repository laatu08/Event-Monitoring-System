import { useEffect, useState } from "react";
import { fetchLogs } from "../api/logs";
import LogsTable from "../components/LogsTable";

export default function LogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [level, setLevel] = useState("");

  useEffect(() => {
    fetchLogs({ level }).then((data) => setLogs(data.logs));
  }, [level]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Logs</h1>

      <select
        className="border p-2 mb-4"
        onChange={(e) => setLevel(e.target.value)}
      >
        <option value="">All Levels</option>
        <option value="error">Error</option>
        <option value="warn">Warn</option>
        <option value="info">Info</option>
      </select>

      <LogsTable logs={logs} />
    </div>
  );
}
