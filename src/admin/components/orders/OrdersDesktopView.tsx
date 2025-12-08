import OrderFilters from "./OrderFilters";
import OrderSummaryCard, {
  type OrderSummaryCardProps,
} from "./OrderSummaryCard";
import { FaShoppingCart } from "react-icons/fa";
import { Clock, CheckCircle2, XCircle } from "lucide-react";
import RecentOrdersTable, { type RecentOrder } from "./RecentOrdersTable";
import type { FC } from "react";

const summaryData: OrderSummaryCardProps[] = [
  {
    title: "Total Orders",
    value: "2,847",
    icon: <FaShoppingCart className="text-blue-600" size={20} />,
    iconBgColor: "bg-blue-100",
    textColor: "text-gray-800",
  },
  {
    title: "Pending",
    value: "143",
    icon: <Clock className="text-orange-500" size={20} />,
    iconBgColor: "bg-orange-100",
    textColor: "text-orange-500",
  },
  {
    title: "Completed",
    value: "2,634",
    icon: <CheckCircle2 className="text-green-500" size={20} />,
    iconBgColor: "bg-green-100",
    textColor: "text-green-500",
  },
  {
    title: "Failed",
    value: "70",
    icon: <XCircle className="text-red-500" size={20} />,
    iconBgColor: "bg-red-100",
    textColor: "text-red-500",
  },
];

interface OrdersDesktopViewProps {
  recentOrders: RecentOrder[];
}
const OrdersDesktopView: FC<OrdersDesktopViewProps> = ({ recentOrders }) => {
  return (
    <div className="w-full mx-auto space-y-5 hidden md:block pt-5">
      <OrderFilters />

      <div className="px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryData.map((card) => (
          <OrderSummaryCard key={card.title} {...card} />
        ))}
      </div>

      <div className="px-6">
        <RecentOrdersTable orders={recentOrders} />
      </div>
    </div>
  );
};

export default OrdersDesktopView;
