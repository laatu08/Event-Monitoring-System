type Incident = {
  id: string;
  service: string;
  errorCount: number;
  windowMinutes: number;
  triggeredAt: string;
};

export function IncidentTable({ incidents }: { incidents: Incident[] }) {
  return (
    <div className="bg-white rounded shadow">
      <table className="w-full text-sm">
        <thead className="bg-slate-100 text-left">
          <tr>
            <th className="p-3">Time</th>
            <th className="p-3">Service</th>
            <th className="p-3">Errors</th>
            <th className="p-3">Window</th>
          </tr>
        </thead>
        <tbody>
          {incidents.map((i) => (
            <tr key={i.id} className="border-t">
              <td className="p-3">
                {new Date(i.triggeredAt).toLocaleString()}
              </td>
              <td className="p-3 font-medium">{i.service}</td>
              <td className="p-3 text-red-600">{i.errorCount}</td>
              <td className="p-3">{i.windowMinutes} min</td>
            </tr>
          ))}

          {incidents.length === 0 && (
            <tr>
              <td
                colSpan={4}
                className="p-6 text-center text-slate-500"
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
