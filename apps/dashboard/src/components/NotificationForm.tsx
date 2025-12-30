import { useState } from "react";
import { createChannel } from "../api/notifications";

export function NotificationForm({
  onCreated
}: {
  onCreated: () => void;
}) {
  const [target, setTarget] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    await createChannel({
      type: "webhook",
      target
    });

    setTarget("");
    onCreated();
  }

  return (
    <form
      onSubmit={submit}
      className="bg-white p-4 rounded shadow space-y-3"
    >
      <h3 className="font-semibold">Add Webhook</h3>

      <input
        className="border p-2 rounded w-full"
        placeholder="Webhook URL"
        value={target}
        onChange={(e) => setTarget(e.target.value)}
      />

      <button
        className="bg-slate-900 text-white px-4 py-2 rounded"
        type="submit"
      >
        Add
      </button>
    </form>
  );
}
