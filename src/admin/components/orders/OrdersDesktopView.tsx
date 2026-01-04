import type { FC } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { Clock, CheckCircle2, XCircle } from "lucide-react";

import OrderFilters, { type OrderFiltersState } from "./OrderFilters";
import OrderSummaryCard, {
  type OrderSummaryCardProps,
} from "./OrderSummaryCard";
import RecentOrdersTable, { type RecentOrder } from "./RecentOrdersTable";

/* -------------------- SUMMARY CARDS (STATIC FOR NOW) -------------------- */

/* -------------------- PROPS -------------------- */

interface OrdersDesktopViewProps {
  filters: OrderFiltersState;
  onFiltersChange: (next: Partial<OrderFiltersState>) => void;

  orders: RecentOrder[];

  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;

  summaryCounts: {
    total: number;
    pending: number;
    completed: number;
    failed: number;
  };
}

/* -------------------- COMPONENT -------------------- */

const OrdersDesktopView: FC<OrdersDesktopViewProps> = ({
  filters,
  onFiltersChange,
  orders,
  currentPage,
  totalPages,
  onPageChange,
  summaryCounts,
}) => {
  return (
    <div className="w-full mx-auto space-y-5 hidden md:block pt-5">
      {/* FILTERS */}
      <OrderFilters filters={filters} onChange={onFiltersChange} />

      {/* SUMMARY */}
      <div className="px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <OrderSummaryCard
          title="Total Orders"
          value={summaryCounts.total.toString()}
          icon={<FaShoppingCart className="text-blue-600" size={20} />}
          iconBgColor="bg-blue-100"
          textColor="text-gray-800"
        />

        <OrderSummaryCard
          title="Pending"
          value={summaryCounts.pending.toString()}
          icon={<Clock className="text-orange-500" size={20} />}
          iconBgColor="bg-orange-100"
          textColor="text-orange-500"
        />

        <OrderSummaryCard
          title="Completed"
          value={summaryCounts.completed.toString()}
          icon={<CheckCircle2 className="text-green-500" size={20} />}
          iconBgColor="bg-green-100"
          textColor="text-green-500"
        />

        <OrderSummaryCard
          title="Failed"
          value={summaryCounts.failed.toString()}
          icon={<XCircle className="text-red-500" size={20} />}
          iconBgColor="bg-red-100"
          textColor="text-red-500"
        />
      </div>

      {/* TABLE */}
      <div className="px-6">
        <RecentOrdersTable
          orders={orders}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default OrdersDesktopView;
