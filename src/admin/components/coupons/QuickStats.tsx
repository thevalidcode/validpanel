import { type ReactNode } from "react";

interface StatItem {
  icon: ReactNode;
  label: string;
  value: number | string;
}

interface QuickStatsProps {
  title: string;
  stats: StatItem[];
}

export default function QuickStats({ title, stats }: QuickStatsProps) {
  return (
    <div className="rounded-[4px] bg-white border border-gray-200 w-full lg:w-80 flex-shrink-0 h-fit">
      <div className="p-6 flex flex-col border-b rounded-t-lg border-gray-200">
        <h2 className="text-xl font-semibold inter">{title}</h2>
      </div>
      <div className="p-6 space-y-4">
        {stats.map((stat, index) => (
          <div key={index} className="flex justify-between items-center">
            <div className="flex gap-2 items-center justify-center">
              <div className="p-2 bg-purple-200 rounded-full flex items-center justify-center text-purple-700">
                {stat.icon}
              </div>
              <span className="text-gray-700 font-medium text-sm">
                {stat.label}
              </span>
            </div>
            <span className="font-semibold text-gray-900">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
