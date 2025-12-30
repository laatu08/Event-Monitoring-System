type Log = {
  service: string;
  level: string;
  message: string;
  timestamp: string;
};

export default function LogsTable({ logs }: { logs: Log[] }) {
  return (
    <table className="w-full border text-sm">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2">Time</th>
          <th className="p-2">Service</th>
          <th className="p-2">Level</th>
          <th className="p-2">Message</th>
        </tr>
      </thead>
      <tbody>
        {logs.map((log, i) => (
          <tr key={i} className="border-t">
            <td className="p-2">
              {new Date(log.timestamp).toLocaleString()}
            </td>
            <td className="p-2">{log.service}</td>
            <td className="p-2 font-bold">{log.level}</td>
            <td className="p-2">{log.message}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
