import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

type Point = { time: string; count: number };

export function ErrorChart({ data }: { data: Point[] }) {
  return (
    <div className="h-100 bg-white rounded shadow p-4">
      <h3 className="text-lg font-semibold mb-4">Error Trend</h3>

      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data}>
          <XAxis dataKey="time" hide />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#ef4444"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
