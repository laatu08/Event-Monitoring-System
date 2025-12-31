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
  const hasData = data && data.length > 0;

  return (
    <div className="h-136 bg-white rounded-xl shadow-sm p-6 flex flex-col">
      {/* Heading */}
      <h3 className="text-lg font-semibold text-center text-slate-700 mb-4">
        Error Trend
      </h3>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center">
        {!hasData ? (
          <div className="text-slate-500 text-center">
            No error data available for this time range
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis
                dataKey="time"
                hide
              />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#ef4444"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
