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
    <div className="bg-white rounded shadow">
      <table className="w-full text-sm">
        <thead className="bg-slate-100">
          <tr>
            <th className="p-3">Service</th>
            <th className="p-3">Threshold</th>
            <th className="p-3">Window</th>
            <th className="p-3">Cooldown</th>
            <th className="p-3">Enabled</th>
            <th className="p-3"></th>
          </tr>
        </thead>
        <tbody>
          {rules.map((r) => (
            <tr key={r.id} className="border-t">
              <td className="p-3">{r.service}</td>
              <td className="p-3">{r.threshold}</td>
              <td className="p-3">{r.windowMinutes} min</td>
              <td className="p-3">{r.cooldownMinutes} min</td>
              <td className="p-3">
                <ToggleSwitch
                  enabled={r.enabled}
                  onChange={async (v) => {
                    await toggleAlertRule(r.id, v);
                    onChange();
                  }}
                />
              </td>
              <td className="p-3">
                <button
                  className="text-red-600"
                  onClick={async () => {
                    await deleteAlertRule(r.id);
                    onChange();
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {rules.length === 0 && (
            <tr>
              <td colSpan={6} className="p-6 text-center text-slate-500">
                No alert rules
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
