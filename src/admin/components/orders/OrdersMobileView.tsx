import { useState } from "react";
import OrderCard, { type Order } from "./OrderCard";

const orderTabs = [
  { name: "All", count: 24, color: "blue" },
  { name: "Pending", count: 8, color: "orange" },
  { name: "Processing", count: 6, color: "blue" },
  { name: "Completed", count: 10, color: "green" },
  { name: "Failed", count: 10, color: "red" },
];
export type NameType =
  | "All"
  | "Pending"
  | "Processing"
  | "Completed"
  | "Failed";
interface OrdersMobileViewProps {
  orders: Order[];
  activeTab: "All" | "Pending" | "Processing" | "Completed" | "Failed";
  setActiveTab: (
    value: "All" | "Pending" | "Processing" | "Completed" | "Failed"
  ) => void;
}

const OrdersMobileView: React.FC<OrdersMobileViewProps> = ({
  orders,
  activeTab,
  setActiveTab,
}) => {
  const [order, setOrder] = useState("");
  // const [activeTab, setActiveTab] = useState("All");

  const badgeColors: { [key: string]: string } = {
    blue: "bg-blue-100 text-blue-600",
    orange: "bg-orange-100 text-orange-600",
    green: "bg-green-100 text-green-600",
    red: "bg-red-100 text-red-600",
  };

  return (
    <div className="md:hidden w-full space-y-10 px-5 pt-5">
      <div className="w-full gap-5 flex items-center justify-between">
        <select
          title="ststua"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full "
        >
          <option>All </option>
          <option>Pending</option>
          <option>Processing</option>
          <option>Completed</option>
          <option>Failed</option>
        </select>
        <button className="border bg-primary flex items-center justify-center gap-2 text-white hover:bg-primary/90 px-8 py-2 rounded-lg">
          <img src="/images/filter.svg" alt="filter users" />
          <span>Filters</span>
        </button>
      </div>
      <input
        type="text"
        placeholder="Search orders, users, services... "
        // value={search}
        // onChange={(e) => onSetSearch(e.target.value)}
        className="w-full border border-gray-300 text-sm pl-6 rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />

      <div className="border-b border-gray-200 flex justify-center">
        <div className="flex items-center -mb-px space-x-4 overflow-x-auto">
          {orderTabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name as NameType)}
              className={`flex-shrink-0 pb-2 border-b-2 ${
                activeTab === tab.name
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } focus:outline-none`}
            >
              <span className="flex items-center gap-2 text-sm font-medium">
                <span>{tab.name}</span>
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

      <div className="space-y-4">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
};

export default OrdersMobileView;
