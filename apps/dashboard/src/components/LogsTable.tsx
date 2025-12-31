type Log = {
  service: string;
  level: string;
  message: string;
  timestamp: string;
};

const LEVEL_STYLE: Record<string, string> = {
  debug: "text-slate-500",
  info: "text-blue-600",
  warn: "text-yellow-600",
  error: "text-red-600",
  fatal: "text-red-800 font-semibold"
};

export default function LogsTable({ logs }: { logs: Log[] }) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-100 text-slate-700">
            <th className="px-4 py-3 text-center font-semibold">
              Time
            </th>
            <th className="px-4 py-3 text-center font-semibold">
              Service
            </th>
            <th className="px-4 py-3 text-center font-semibold">
              Level
            </th>
            <th className="px-4 py-3 text-center font-semibold">
              Message
            </th>
          </tr>
        </thead>

        <tbody>
          {logs.map((log, i) => (
            <tr
              key={i}
              className="border-t hover:bg-slate-50 transition"
            >
              <td className="px-4 py-3 text-center font-mono text-slate-600">
                {new Date(log.timestamp).toLocaleString()}
              </td>

              <td className="px-4 py-3 text-center text-slate-700">
                {log.service}
              </td>

              <td
                className={`px-4 py-3 text-center uppercase ${
                  LEVEL_STYLE[log.level] || ""
                }`}
              >
                {log.level}
              </td>

              <td className="px-4 py-3 text-center text-slate-700 max-w-xl truncate">
                {log.message}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {logs.length === 0 && (
        <div className="p-6 text-center text-slate-500">
          No logs to display
        </div>
      )}
    </div>
  );
}
