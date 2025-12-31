import { useState } from "react";
import { createChannel } from "../api/notifications";

export function NotificationForm({
  onCreated
}: {
  onCreated: () => void;
}) {
  const [target, setTarget] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!target) return;

    setIsSubmitting(true);
    try {
      await createChannel({
        type: "webhook",
        target
      });

      setTarget("");
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
        <h3 className="text-lg font-semibold text-slate-800">
          Add Webhook Channel
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          Alerts will be sent as HTTP POST requests to this endpoint.
        </p>
      </div>

      {/* Webhook URL */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">
          Webhook URL
        </label>
        <input
          type="url"
          className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-slate-900"
          placeholder="https://example.com/webhook"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          required
        />
        <p className="text-xs text-slate-500">
          Must be a publicly accessible HTTPS endpoint
        </p>
      </div>

      {/* Action */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting || !target}
          className="bg-slate-900 text-white px-5 py-2 rounded-md text-sm font-medium
                     hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Adding…" : "Add Webhook"}
        </button>
      </div>
    </form>
  );
}
