import { useState } from "react";
import OrderCard, { type Order } from "./OrderCard";

/* -------------------- TYPES -------------------- */

export type NameType =
  | "All"
  | "Pending"
  | "Processing"
  | "Completed"
  | "Failed";

interface OrdersMobileViewProps {
  orders: Order[];
  activeTab: NameType;
  setActiveTab: (value: NameType) => void;
  summaryCounts: {
    total: number;
    pending: number;
    completed: number;
    failed: number;
  };
  filters: {
    status: NameType;
    orderType: "All" | "Store Order" | "Shop Order";
    search: string;
    date: string;
  };
  onFiltersChange: (next: Partial<OrdersMobileViewProps["filters"]>) => void;
}

/* -------------------- COMPONENT -------------------- */

const OrdersMobileView: React.FC<OrdersMobileViewProps> = ({
  orders,
  activeTab,
  setActiveTab,
  summaryCounts,
  filters,
  onFiltersChange,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const orderTabs = [
    { name: "All", count: summaryCounts.total, color: "blue" },
    { name: "Pending", count: summaryCounts.pending, color: "orange" },
    { name: "Completed", count: summaryCounts.completed, color: "green" },
    { name: "Failed", count: summaryCounts.failed, color: "red" },
  ];

  const badgeColors: Record<string, string> = {
    blue: "bg-blue-100 text-blue-600",
    orange: "bg-orange-100 text-orange-600",
    green: "bg-green-100 text-green-600",
    red: "bg-red-100 text-red-600",
  };

  /* -------------------- CLEAR FILTERS -------------------- */

  const clearFilters = () => {
    onFiltersChange({
      status: "All",
      orderType: "All",
      search: "",
      date: "",
    });
  };

  return (
    <div className="md:hidden w-full space-y-6 px-5 pt-5">
      {/* TOP BAR */}
      <div className="flex gap-3">
        <select
          value={filters.status}
          onChange={(e) =>
            onFiltersChange({ status: e.target.value as NameType })
          }
          className="border border-gray-300 rounded-lg px-3 py-2 flex-1"
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Completed">Completed</option>
          <option value="Failed">Failed</option>
        </select>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="border bg-primary text-white px-4 py-2 rounded-lg"
        >
          Filters
        </button>
      </div>

      {/* STATUS TABS */}
      <div className="border-b border-gray-200">
        <div className="flex items-center -mb-px space-x-4 overflow-x-auto">
          {orderTabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name as NameType)}
              className={`pb-2 border-b-2 ${
                activeTab === tab.name
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500"
              }`}
            >
              <span className="flex items-center gap-2 text-sm">
                {tab.name}
                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${
                    badgeColors[tab.color]
                  }`}
                >
                  {tab.count}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ORDERS */}
      <div className="space-y-4">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>

      {/* FILTER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end">
          <div className="bg-white w-full rounded-t-2xl p-5 space-y-4">
            {/* HEADER */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Filters</h3>

              {/* CLEAR FILTER BADGE */}
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-medium text-red-600 bg-red-50 px-3 py-1 rounded-full hover:bg-red-100"
              >
                Clear filters
              </button>
            </div>

            {/* STATUS */}
            <select
              value={filters.status}
              onChange={(e) =>
                onFiltersChange({ status: e.target.value as NameType })
              }
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Completed">Completed</option>
              <option value="Failed">Failed</option>
            </select>

            {/* ORDER TYPE */}
            <select
              value={filters.orderType}
              onChange={(e) =>
                onFiltersChange({
                  orderType: e.target.value as
                    | "All"
                    | "Store Order"
                    | "Shop Order",
                })
              }
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="All">All Orders</option>
              <option value="Store Order">Store Order</option>
              <option value="Shop Order">Shop Order</option>
            </select>

            {/* DATE */}
            <input
              type="date"
              value={filters.date}
              onChange={(e) => onFiltersChange({ date: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
            />

            {/* SEARCH */}
            <input
              type="text"
              value={filters.search}
              onChange={(e) => onFiltersChange({ search: e.target.value })}
              placeholder="Search orders, users, services..."
              className="w-full border rounded-lg px-3 py-2"
            />

            {/* ACTIONS */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full border rounded-lg py-2"
              >
                Close
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full bg-primary text-white rounded-lg py-2"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersMobileView;
