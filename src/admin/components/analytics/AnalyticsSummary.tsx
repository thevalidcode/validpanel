import type { FC, ReactNode } from "react";

export interface AnalyticsCardProps {
  icon: ReactNode;
  title: string;
  value: string;
  percentage: number;
}

const AnalyticsCard: FC<AnalyticsCardProps> = ({
  icon,
  title,
  value,
  percentage,
}) => (
  <div className="bg-gradient-to-r from-[#7D1EFE] to-[#6A0DAD] text-white p-5 rounded-xl shadow-lg flex flex-col gap-4">
    <div className="flex justify-between items-start">
      <div className="bg-white/10 p-2 rounded-lg">{icon}</div>
      <div className="bg-white/20 text-xs font-semibold px-2.5 py-1 rounded-full">
        +{percentage}%
      </div>
    </div>
    <div>
      <h3 className="text-3xl font-bold">{value}</h3>
      <p className="text-sm text-purple-200">{title}</p>
    </div>
  </div>
);

export default AnalyticsCard;
