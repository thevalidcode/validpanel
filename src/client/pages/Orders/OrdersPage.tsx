import DashboardLayout from "../../components/general/DashboardLayout";
import OrdersDesktopView from "./OrdersDesktopView";
import OrdersMobileView, { type NameType } from "./OrdersMobileView";
import type { Order } from "./OrderCard";
import type { RecentOrder } from "./RecentOrdersTable";
import { useState } from "react";

const ordersData: Order[] = [
  {
    id: "#ORD-2024-001",
    status: "Pending",
    orderType: "Store Order",
    time: "2 hours ago",
    customer: {
      name: "John Smith",
      avatar: "/images/mobile-2.png", // Placeholder, replace with actual path
      service: "Premium Cleaning Service",
    },
    price: "$89.99",
  },
  {
    id: "#ORD-2024-002",
    status: "Processing",
    orderType: "Shop Order",
    time: "4 hours ago",
    customer: {
      name: "Sarah Johnson",
      avatar: "/images/mobile-2.png", // Placeholder
      service: "Hair Styling Package",
    },
    price: "$145.00",
  },
  {
    id: "#ORD-2024-003",
    status: "Completed",
    orderType: "Store Order",
    time: "1 day ago",
    customer: {
      name: "Mike Davis",
      avatar: "/images/mobile-2.png", // Placeholder
      service: "Car Wash Deluxe",
    },
    price: "$65.50",
  },
  {
    id: "#ORD-2024-004",
    status: "Failed",
    orderType: "Shop Order",
    time: "2 days ago",
    customer: {
      name: "Emma Wilson",
      avatar: "/images/mobile-2.png", // Placeholder
      service: "Massage Therapy Session",
    },
    price: "$120.00",
  },
];

const recentOrdersData: RecentOrder[] = [
  {
    orderId: "#ORD-2024-001",
    customer: {
      name: "Sarah Johnson",
      email: "sarah@example.com",
      avatar: "/images/desktop-3.png",
    },
    type: "Store",
    currency: "USD",
    amount: "$89.99",
    status: "Completed",
    date: "2024-01-15",
  },
  {
    orderId: "#ORD-2024-002",
    customer: {
      name: "Mike Chen",
      email: "mike@example.com",
      avatar: "/images/desktop-3.png",
    },
    type: "Shop",
    currency: "EUR",
    amount: "$45.50",
    status: "Processing",
    date: "2024-01-14",
  },
  {
    orderId: "#ORD-2024-003",
    customer: {
      name: "Emma Wilson",
      email: "emma@example.com",
      avatar: "/images/desktop-3.png",
    },
    type: "Store",
    currency: "USD",
    amount: "$29.99",
    status: "Failed",
    date: "2024-01-13",
  },
];

const OrdersPage = () => {
  const [activeTab, setActiveTab] = useState<NameType>("All");
  const filteredOrder = ordersData.filter((order) => {
    if (activeTab === "All") return true;
    return order.status === activeTab;
  });
  return (
    <DashboardLayout role="admin">
      <OrdersMobileView
        orders={filteredOrder}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <OrdersDesktopView recentOrders={recentOrdersData} />
    </DashboardLayout>
  );
};

export default OrdersPage;
