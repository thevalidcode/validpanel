import { type FC } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export type TimeRange = "Last 7 days" | "Last 30 days" | "Last 90 days";

interface RevenueTrendProps {
  dataSets: Record<TimeRange, { name: string; value: number }[]>;
  range: TimeRange;
  setRange: (value: TimeRange) => void;
}

const RevenueTrend: FC<RevenueTrendProps> = ({ dataSets, range, setRange }) => {
  const data = dataSets[range];

  return (
    <div className="w-full bg-white border border-gray-200 mx-auto rounded-xl p-4 shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-gray-800">Revenue Trend</h2>
        <select
          value={range}
          onChange={(e) => setRange(e.target.value as TimeRange)}
          className="border border-gray-300 rounded-md text-sm px-2 py-1 focus:ring-2 focus:ring-purple-500"
        >
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 90 days</option>
        </select>
      </div>

      <div className="h-60 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="name"
              stroke="#888"
              tickLine={false}
              axisLine={false}
            />
            <YAxis stroke="#888" tickLine={false} axisLine={false} />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#6366F1"
              strokeWidth={3}
              dot={{ r: 4, fill: "#6366F1" }}
              fillOpacity={1}
              fill="url(#colorValue)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueTrend;
