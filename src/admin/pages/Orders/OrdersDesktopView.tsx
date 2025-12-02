import { FaDownload } from "react-icons/fa";
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
    <div className="w-full mx-auto space-y-5 hidden md:block ">
      {/* Header */}
      <div className=" w-full flex h-20.5 px-6 justify-between items-center border border-[#E5E7EB] bg-white ">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">
            Orders Management
          </h1>
          <p className="text-sm text-gray-500">
            Manage and track all store and shop orders
          </p>
        </div>
        <div className="flex gap-4 items-center">
          <button className="border bg-primary flex items-center justify-center gap-2 text-white hover:bg-primary/90 px-8 py-2 rounded-lg">
            <FaDownload size={16} />
            <span>Export Orders</span>
          </button>
          <img
            src="/Sarah.png"
            alt="Admin Avatar"
            className="w-8 h-8 rounded-full"
          />
        </div>
      </div>

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
