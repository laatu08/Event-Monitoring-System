import { useEffect, useState } from "react";
import { fetchErrorMetrics } from "../api/metrics";
import { ErrorChart } from "../components/ErrorChart";

export default function Overview() {
  const [data, setData] = useState<any[]>([]);
  const [service, setService] = useState("auth-service");
  const [window, setWindow] = useState(60);

  useEffect(() => {
    fetchErrorMetrics({ service, window }).then(setData);
  }, [service, window]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Overview</h1>

      {/* Controls */}
      <div className="flex gap-4">
        <select
          className="border p-2 rounded"
          value={service}
          onChange={(e) => setService(e.target.value)}
        >
          <option value="auth-service">auth-service</option>
        </select>

        <select
          className="border p-2 rounded"
          value={window}
          onChange={(e) => setWindow(Number(e.target.value))}
        >
          <option value={10}>Last 10 min</option>
          <option value={60}>Last 1 hour</option>
          <option value={1440}>Last 24 hours</option>
        </select>
      </div>

      {/* Chart */}
      <ErrorChart data={data} />
    </div>
  );
}
