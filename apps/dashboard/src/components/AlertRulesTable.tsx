import { ToggleSwitch } from "./ToggleSwitch";
import { deleteAlertRule, toggleAlertRule } from "../api/alerts";

export function AlertRulesTable({
  rules,
  onChange
}: {
  rules: any[];
  onChange: () => void;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-100 text-slate-700">
            <th className="px-4 py-3 text-center font-semibold">
              Service
            </th>
            <th className="px-4 py-3 text-center font-semibold">
              Threshold
            </th>
            <th className="px-4 py-3 text-center font-semibold">
              Window
            </th>
            <th className="px-4 py-3 text-center font-semibold">
              Cooldown
            </th>
            <th className="px-4 py-3 text-center font-semibold">
              Enabled
            </th>
            <th className="px-4 py-3 text-center font-semibold">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {rules.map((r) => (
            <tr
              key={r.id}
              className="border-t hover:bg-slate-50 transition"
            >
              <td className="px-4 py-3 text-center font-medium text-slate-700">
                {r.service}
              </td>

              <td className="px-4 py-3 text-center">
                <span className="px-2 py-1 rounded bg-slate-100 text-slate-700 font-semibold">
                  {r.threshold}
                </span>
              </td>

              <td className="px-4 py-3 text-center text-slate-700">
                {r.windowMinutes} min
              </td>

              <td className="px-4 py-3 text-center text-slate-700">
                {r.cooldownMinutes} min
              </td>

              <td className="px-4 py-3 flex justify-center">
                <ToggleSwitch
                  enabled={r.enabled}
                  onChange={async (v) => {
                    await toggleAlertRule(r.id, v);
                    onChange();
                  }}
                />
              </td>

              <td className="px-4 py-3 text-center">
                <button
                  className="text-red-600 text-sm hover:underline"
                  onClick={async () => {
                    if (
                      confirm(
                        "Are you sure you want to delete this alert rule?"
                      )
                    ) {
                      await deleteAlertRule(r.id);
                      onChange();
                    }
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {rules.length === 0 && (
            <tr>
              <td
                colSpan={6}
                className="px-6 py-12 text-center text-slate-500"
              >
                No alert rules configured
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
