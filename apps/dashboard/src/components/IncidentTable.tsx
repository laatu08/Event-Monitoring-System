type Incident = {
  id: string;
  service: string;
  errorCount: number;
  windowMinutes: number;
  triggeredAt: string;
};

export function IncidentTable({ incidents }: { incidents: Incident[] }) {
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
              Errors
            </th>
            <th className="px-4 py-3 text-center font-semibold">
              Window
            </th>
          </tr>
        </thead>

        <tbody>
          {incidents.map((i) => (
            <tr
              key={i.id}
              className="border-t hover:bg-slate-50 transition"
            >
              <td className="px-4 py-3 text-center font-mono text-slate-600">
                {new Date(i.triggeredAt).toLocaleString()}
              </td>

              <td className="px-4 py-3 text-center font-medium text-slate-700">
                {i.service}
              </td>

              <td className="px-4 py-3 text-center">
                <span
                  className={`px-2 py-1 rounded text-sm font-semibold ${
                    i.errorCount >= 10
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {i.errorCount}
                </span>
              </td>

              <td className="px-4 py-3 text-center text-slate-700">
                {i.windowMinutes} min
              </td>
            </tr>
          ))}

          {incidents.length === 0 && (
            <tr>
              <td
                colSpan={4}
                className="px-6 py-12 text-center text-slate-500"
              >
                No incidents recorded
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
