import { ToggleSwitch } from "./ToggleSwitch";
import { toggleChannel } from "../api/notifications";

export function NotificationTable({
  channels,
  onChange
}: {
  channels: any[];
  onChange: () => void;
}) {
  return (
    <div className="bg-white rounded shadow">
      <table className="w-full text-sm">
        <thead className="bg-slate-100">
          <tr>
            <th className="p-3">Type</th>
            <th className="p-3">Target</th>
            <th className="p-3">Enabled</th>
          </tr>
        </thead>
        <tbody>
          {channels.map((c) => (
            <tr key={c.id} className="border-t">
              <td className="p-3">{c.type}</td>
              <td className="p-3 truncate max-w-md">{c.target}</td>
              <td className="p-3">
                <ToggleSwitch
                  enabled={c.enabled}
                  onChange={async (v) => {
                    await toggleChannel(c.id, v);
                    onChange();
                  }}
                />
              </td>
            </tr>
          ))}

          {channels.length === 0 && (
            <tr>
              <td colSpan={3} className="p-6 text-center text-slate-500">
                No notification channels
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
