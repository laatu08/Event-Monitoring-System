import { useEffect, useState } from "react";
import { fetchAlertRules } from "../api/alerts";
import { AlertRuleForm } from "../components/AlertRuleForm";
import { AlertRulesTable } from "../components/AlertRulesTable";

export default function AlertRules() {
  const [rules, setRules] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  async function load() {
    setIsLoading(true);
    try {
      const data = await fetchAlertRules();
      setRules(data);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const total = rules.length;
  const enabled = rules.filter((r) => r.enabled).length;
  const disabled = total - enabled;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Alert Rules</h1>

        <button
          onClick={load}
          className="text-sm border px-3 py-1.5 rounded hover:bg-slate-100"
        >
          Refresh
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard label="Total Rules" value={total} />
        <SummaryCard label="Enabled" value={enabled} highlight="green" />
        <SummaryCard label="Disabled" value={disabled} highlight="yellow" />
      </div>

      {/* Create Rule */}
      <div className="bg-white rounded shadow p-4">
        <h2 className="text-lg font-semibold mb-2">
          Create Alert Rule
        </h2>
        <AlertRuleForm onCreated={load} />
      </div>

      {/* Rules List */}
      {isLoading ? (
        <div className="bg-white rounded shadow p-6">
          <Skeleton />
        </div>
      ) : rules.length === 0 ? (
        <div className="bg-white rounded shadow h-64 flex flex-col items-center justify-center text-center px-6">
          <h2 className="text-lg font-semibold text-slate-700">
            No alert rules yet
          </h2>
          <p className="text-slate-500 mt-2 max-w-md">
            Create alert rules to monitor services and get notified
            when error thresholds are exceeded.
          </p>
        </div>
      ) : (
        <AlertRulesTable rules={rules} onChange={load} />
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
