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
    <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-100 text-slate-700">
            <th className="px-4 py-3 text-center font-semibold">
              Type
            </th>
            <th className="px-4 py-3 text-center font-semibold">
              Target
            </th>
            <th className="px-4 py-3 text-center font-semibold">
              Enabled
            </th>
          </tr>
        </thead>

        <tbody>
          {channels.map((c) => (
            <tr
              key={c.id}
              className="border-t hover:bg-slate-50 transition"
            >
              <td className="px-4 py-3 text-center text-slate-700 uppercase">
                {c.type}
              </td>

              <td className="px-4 py-3 text-center max-w-md mx-auto truncate text-slate-700">
                {c.target}
              </td>

              <td className="px-4 py-3 flex justify-center">
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
              <td
                colSpan={3}
                className="px-6 py-12 text-center text-slate-500"
              >
                No notification channels configured
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
