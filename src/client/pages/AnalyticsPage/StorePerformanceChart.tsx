import type { FC } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export interface StorePerformanceData {
  name: string;
  revenue: number;
}

interface StorePerformanceChartProps {
  data: StorePerformanceData[];
}

const StorePerformanceChart: FC<StorePerformanceChartProps> = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm w-full border border-gray-200">
      <h2 className="text-lg font-bold text-gray-800 mb-4">
        Store Performance
      </h2>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              dy={10}
              tick={{ fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `${value / 1000}k`}
              domain={[0, 50000]}
            />
            <Tooltip cursor={{ fill: "transparent" }} />
            <Bar
              dataKey="revenue"
              fill="#8B5CF6"
              barSize={30}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StorePerformanceChart;
