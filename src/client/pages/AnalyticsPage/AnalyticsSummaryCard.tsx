import type { FC, ReactNode } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

export interface AnalyticsSummaryCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "increase" | "decrease";
  icon: ReactNode;
  iconBg: string;
}

const AnalyticsSummaryCard: FC<AnalyticsSummaryCardProps> = ({
  title,
  value,
  change,
  changeType,
  icon,
  iconBg,
}) => {
  const isIncrease = changeType === "increase";
  const changeColor = isIncrease ? "text-purple-600" : "text-red-500";
  const ChangeIcon = isIncrease ? ArrowUp : ArrowDown;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-start">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
        <div className={`flex items-center mt-2 text-xs ${changeColor}`}>
          <ChangeIcon size={14} className="mr-1" />
          <span>{change}</span>
        </div>
      </div>
      <div className={`p-2 rounded-lg ${iconBg}`}>{icon}</div>
    </div>
  );
};

export default AnalyticsSummaryCard;
