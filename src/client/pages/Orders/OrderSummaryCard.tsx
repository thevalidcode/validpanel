import type { FC, ReactNode } from "react";

export interface OrderSummaryCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  iconBgColor: string;
  textColor: string;
}

const OrderSummaryCard: FC<OrderSummaryCardProps> = ({
  title,
  value,
  icon,
  iconBgColor,
  textColor,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm flex items-center justify-between border border-gray-200">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
      </div>
      <div
        className={`p-3 rounded-full w-10 h-12 grid place-content-center ${iconBgColor}`}
      >
        {icon}
      </div>
    </div>
  );
};

export default OrderSummaryCard;
