import type { FC } from "react";
import type { NameType } from "./OrdersMobileView";

/* -------------------- TYPES -------------------- */

export interface OrderFiltersState {
  status: NameType;
  orderType: "All" | "Store Order" | "Shop Order";
  search: string;
  date: string; // YYYY-MM-DD
}

interface OrderFiltersProps {
  filters: OrderFiltersState;
  onChange: (next: Partial<OrderFiltersState>) => void;
}

/* -------------------- COMPONENT -------------------- */

const OrderFilters: FC<OrderFiltersProps> = ({ filters, onChange }) => {
  return (
    <div className="px-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end bg-white border-gray-200 px-6 py-6 rounded-lg">
        {/* ORDER TYPE */}
        <div>
          <label
            htmlFor="order-type"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Order Type
          </label>
          <select
            id="order-type"
            value={filters.orderType}
            onChange={(e) =>
              onChange({
                orderType: e.target.value as OrderFiltersState["orderType"],
              })
            }
            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
          >
            <option value="All">All Orders</option>
            <option value="Store Order">Store Order</option>
            <option value="Shop Order">Shop Order</option>
          </select>
        </div>

        {/* STATUS */}
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Status
          </label>
          <select
            id="status"
            value={filters.status}
            onChange={(e) =>
              onChange({
                status: e.target.value as NameType,
              })
            }
            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Completed">Completed</option>
            <option value="Failed">Failed</option>
          </select>
        </div>

        {/* DATE (SINGLE DAY) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            value={filters.date}
            onChange={(e) => onChange({ date: e.target.value })}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
          />
        </div>

        {/* SEARCH */}
        <div>
          <label
            htmlFor="search"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Search
          </label>
          <input
            type="text"
            id="search"
            value={filters.search}
            onChange={(e) =>
              onChange({
                search: e.target.value,
              })
            }
            placeholder="Search by user, service, order ID..."
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default OrderFilters;
