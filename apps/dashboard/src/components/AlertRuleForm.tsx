import { useState } from "react";
import { createAlertRule } from "../api/alerts";

export function AlertRuleForm({ onCreated }: { onCreated: () => void }) {
  const [service, setService] = useState("auth-service");
  const [threshold, setThreshold] = useState(5);
  const [windowMinutes, setWindowMinutes] = useState(10);
  const [cooldownMinutes, setCooldownMinutes] = useState(1);

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    await createAlertRule({
      service,
      threshold,
      windowMinutes,
      cooldownMinutes
    });

    onCreated();
  }

  return (
    <form
      onSubmit={submit}
      className="bg-white p-4 rounded shadow space-y-3"
    >
      <h3 className="font-semibold">Create Alert Rule</h3>

      <input
        className="border p-2 rounded w-full"
        value={service}
        onChange={(e) => setService(e.target.value)}
        placeholder="Service"
      />

      <div className="grid grid-cols-3 gap-2">
        <input
          type="number"
          className="border p-2 rounded"
          value={threshold}
          onChange={(e) => setThreshold(Number(e.target.value))}
          placeholder="Threshold"
        />
        <input
          type="number"
          className="border p-2 rounded"
          value={windowMinutes}
          onChange={(e) => setWindowMinutes(Number(e.target.value))}
          placeholder="Window (min)"
        />
        <input
          type="number"
          className="border p-2 rounded"
          value={cooldownMinutes}
          onChange={(e) => setCooldownMinutes(Number(e.target.value))}
          placeholder="Cooldown (min)"
        />
      </div>

      <button
        className="bg-slate-900 text-white px-4 py-2 rounded"
        type="submit"
      >
        Create
      </button>
    </form>
  );
}
