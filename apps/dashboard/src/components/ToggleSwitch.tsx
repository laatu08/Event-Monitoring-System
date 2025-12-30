export function ToggleSwitch({
  enabled,
  onChange
}: {
  enabled: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`w-12 h-6 rounded-full transition ${
        enabled ? "bg-green-500" : "bg-slate-300"
      }`}
    >
      <div
        className={`h-6 w-6 bg-white rounded-full transform transition ${
          enabled ? "translate-x-6" : "translate-x-0"
        }`}
      />
    </button>
  );
}
