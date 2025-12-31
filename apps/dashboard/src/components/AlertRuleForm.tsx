import { useState } from "react";
import { createAlertRule } from "../api/alerts";

export function AlertRuleForm({ onCreated }: { onCreated: () => void }) {
  const [service, setService] = useState("auth-service");
  const [threshold, setThreshold] = useState(5);
  const [windowMinutes, setWindowMinutes] = useState(10);
  const [cooldownMinutes, setCooldownMinutes] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createAlertRule({
        service,
        threshold,
        windowMinutes,
        cooldownMinutes
      });

      onCreated();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="bg-white rounded-xl shadow-sm p-6 space-y-6"
    >
      {/* Header */}
      <div>
        <p className="text-sm text-slate-500 mt-1">
          Define when an incident should be triggered for a service.
        </p>
      </div>

      {/* Service */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">
          Service name
        </label>
        <input
          className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-slate-900"
          value={service}
          onChange={(e) => setService(e.target.value)}
          placeholder="e.g. auth-service"
        />
        <p className="text-xs text-slate-500">
          Must match the service name used in logs
        </p>
      </div>

      {/* Rule Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Field
          label="Error threshold"
          hint="Number of errors"
          value={threshold}
          onChange={setThreshold}
        />

        <Field
          label="Time window"
          hint="Minutes"
          value={windowMinutes}
          onChange={setWindowMinutes}
        />

        <Field
          label="Cooldown"
          hint="Minutes"
          value={cooldownMinutes}
          onChange={setCooldownMinutes}
        />
      </div>

      {/* Action */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-slate-900 text-white px-5 py-2 rounded-md text-sm font-medium
                     hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Creating…" : "Create Alert Rule"}
        </button>
      </div>
    </form>
  );
}

/* ---------- Small helper component ---------- */

function Field({
  label,
  hint,
  value,
  onChange
}: {
  label: string;
  hint: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="relative">
        <input
          type="number"
          min={1}
          className="border rounded px-3 py-2 w-full pr-12 focus:outline-none focus:ring-2 focus:ring-slate-900"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">
          {hint}
        </span>
      </div>
    </div>
  );
}
