import { useState } from "react";
import OrderCard, { type Order } from "./OrderCard";
import CustomSelect, { type Option } from "@/components/ui/CustomSelect";
import { Pagination } from "@/components/ui/Pagination";

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
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

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

  const statusOptions: Option<NameType>[] = [
    { label: "All", value: "All" },
    { label: "Pending", value: "Pending" },
    { label: "Processing", value: "Processing" },
    { label: "Completed", value: "Completed" },
    { label: "Failed", value: "Failed" },
  ];

  const orderTypeOptions: Option<"All" | "Store Order" | "Shop Order">[] = [
    { label: "All Orders", value: "All" },
    { label: "Store Order", value: "Store Order" },
    { label: "Shop Order", value: "Shop Order" },
  ];

  // Pagination
  const paginatedOrders = orders.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
        <div className="flex-1">
          <CustomSelect
            options={statusOptions}
            value={statusOptions.find((s) => s.value === filters.status)}
            onChange={(option) => {
              if (Array.isArray(option)) return;
              onFiltersChange({ status: option.value });
              setCurrentPage(1);
            }}
            placeholder="Filter status"
          />
        </div>

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
        {paginatedOrders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>

      {/* PAGINATION */}
      {orders.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={orders.length}
          itemsPerPage={PAGE_SIZE}
          onPageChange={handlePageChange}
        />
      )}

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
            <CustomSelect
              options={statusOptions}
              value={statusOptions.find((s) => s.value === filters.status)}
              onChange={(option) => {
                if (Array.isArray(option)) return;
                onFiltersChange({ status: option.value });
              }}
              placeholder="Select status"
            />

            {/* ORDER TYPE */}
            <CustomSelect
              options={orderTypeOptions}
              value={orderTypeOptions.find((o) => o.value === filters.orderType)}
              onChange={(option) => {
                if (Array.isArray(option)) return;
                onFiltersChange({ orderType: option.value });
              }}
              placeholder="Select order type"
            />

            {/* DATE */}
            <input
              type="date"
              value={filters.date}
              onChange={(e) => onFiltersChange({ date: e.target.value })}
              placeholder="Select date"
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
