import type { JSX } from "react";

interface StatCardProps {
  title: string;
  value: string;
  color: string;
  icon: string;
}
export function StatCard({
  title,
  value,
  color,
  icon,
}: StatCardProps): JSX.Element {
  return (
    <div
      className={`flex justify-between items-center p-4 rounded-[4px] border border-gray-300 bg-white ${color}`}
    >
      <div className="text-left">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
      <img src={icon} alt={`${title} icon`} />
    </div>
  );
}
