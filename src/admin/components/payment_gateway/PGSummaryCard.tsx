import type { FC, ReactNode } from "react";

export interface PGSummaryCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  iconBgColor: string;
  textColor: string;
}

const PGSummaryCard: FC<PGSummaryCardProps> = ({
  title,
  value,
  icon,
  iconBgColor,
  textColor,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
      </div>

      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center ${iconBgColor}`}
      >
        {icon}
      </div>
    </div>
  );
};

export default PGSummaryCard;
