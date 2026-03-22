import { ArrowDownRightIcon, ArrowUpIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  change?: string;
  color?: string;
  up?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  change,
  color,
  up,
}) => (
  <div className="bg-white border border-gray-200 rounded-[4px] p-4 flex flex-col gap-1 hover:shadow-sm transition">
    <p className="text-sm text-gray-500">{title}</p>

    <div className="flex justify-between items-center">
      <p className="text-2xl font-semibold text-gray-800">{value}</p>
      <img src={icon} className="w-10 h-10" alt={title} />
    </div>

    {typeof up === "boolean" && change && color && (
      <div className={`flex items-center gap-1 text-sm ${color}`}>
        {up ? (
          <ArrowUpIcon className="w-4 h-4" />
        ) : (
          <ArrowDownRightIcon className="w-4 h-4" />
        )}
        <span>{change}</span>
      </div>
    )}
  </div>
);
