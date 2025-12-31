import { useEffect, useState } from "react";
import { fetchErrorMetrics } from "../api/metrics";
import { fetchServices } from "../api/service";
import { ErrorChart } from "../components/ErrorChart";

type TimeRange = "1h" | "24h" | "7d" | "30d" | "3m" | "6m" | "1y";

export default function Overview() {
  const [data, setData] = useState<any[]>([]);
  const [services, setServices] = useState<string[]>([]);
  const [service, setService] = useState<string | undefined>();
  const [range, setRange] = useState<TimeRange>("1h");

  const [isServicesLoading, setIsServicesLoading] = useState(true);
  const [isMetricsLoading, setIsMetricsLoading] = useState(false);

  // Load services
  useEffect(() => {
    let mounted = true;

    async function loadServices() {
      try {
        const list = await fetchServices();
        if (!mounted) return;

        const sorted = [...list].sort((a, b) =>
          a.localeCompare(b)
        );

        setServices(sorted);
      } finally {
        if (mounted) setIsServicesLoading(false);
      }
    }

    loadServices();
    return () => {
      mounted = false;
    };
  }, []);

  // Load metrics
  useEffect(() => {
    if (!service) return;

    let mounted = true;
    setIsMetricsLoading(true);

    fetchErrorMetrics({ service, range })
      .then((res) => {
        if (mounted) setData(res);
      })
      .finally(() => {
        if (mounted) setIsMetricsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [service, range]);

  if (isServicesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-500 animate-pulse">
          Loading services…
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Overview</h1>

      {/* Controls */}
      <div className="flex gap-4">
        <select
          className="border p-2 rounded"
          value={service ?? ""}
          onChange={(e) =>
            setService(e.target.value || undefined)
          }
        >
          <option value="">Select a service</option>
          {services.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          className="border p-2 rounded disabled:opacity-50"
          value={range}
          disabled={!service}
          onChange={(e) => setRange(e.target.value as TimeRange)}
        >
          <option value="1h">Last 1 hour</option>
          <option value="24h">Last 24 hours</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="3m">Last 3 months</option>
          <option value="6m">Last 6 months</option>
          <option value="1y">Last 1 year</option>
        </select>
      </div>

      {/* Content */}
      {!service ? (
        <div className="h-80 bg-white rounded shadow flex flex-col items-center justify-center text-center px-6">
          <h2 className="text-xl font-semibold text-slate-700">
            Select a service to get started
          </h2>
          <p className="text-slate-500 mt-2 max-w-md">
            Choose a service from the dropdown above to view error
            trends, alerts, and system health over time.
          </p>
        </div>
      ) : isMetricsLoading ? (
        <div className="h-80 bg-white rounded shadow flex items-center justify-center">
          <div className="text-slate-400 animate-pulse">
            Loading metrics…
          </div>
        </div>
      ) : (
        <ErrorChart data={data} />
      )}
    </div>
  );
}
