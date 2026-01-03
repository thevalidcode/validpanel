import { useMemo, useState } from "react";
import Layout from "@/admin/components/Layout";

import OrdersDesktopView from "../components/orders/OrdersDesktopView";
import OrdersMobileView, {
  type NameType,
} from "../components/orders/OrdersMobileView";

import type { Order } from "../components/orders/OrderCard";
import type { RecentOrder } from "../components/orders/RecentOrdersTable";
import type { OrderFiltersState } from "../components/orders/OrderFilters";

/* -------------------- DATA SOURCE -------------------- */

const ordersData: Order[] = [
  {
    id: "#ORD-2024-001",
    status: "Pending",
    orderType: "Store Order",
    time: "2024-01-15",
    customer: {
      name: "John Smith",
      avatar: "/images/mobile-2.png",
      service: "Premium Cleaning Service",
    },
    price: "$89.99",
  },
  {
    id: "#ORD-2024-002",
    status: "Processing",
    orderType: "Shop Order",
    time: "2024-01-14",
    customer: {
      name: "Sarah Johnson",
      avatar: "/images/mobile-2.png",
      service: "Hair Styling Package",
    },
    price: "$145.00",
  },
  {
    id: "#ORD-2024-003",
    status: "Completed",
    orderType: "Store Order",
    time: "2024-01-13",
    customer: {
      name: "Mike Davis",
      avatar: "/images/mobile-2.png",
      service: "Car Wash Deluxe",
    },
    price: "$65.50",
  },
  {
    id: "#ORD-2024-004",
    status: "Failed",
    orderType: "Shop Order",
    time: "2024-01-12",
    customer: {
      name: "Emma Wilson",
      avatar: "/images/mobile-2.png",
      service: "Massage Therapy Session",
    },
    price: "$120.00",
  },
];

const PAGE_SIZE = 10;

/* -------------------- PAGE -------------------- */

const OrdersPage = () => {
  const [filters, setFilters] = useState<OrderFiltersState>({
    status: "All",
    orderType: "All",
    search: "",
    date: "",
  });

  const [currentPage, setCurrentPage] = useState(1);

  /* -------------------- FILTERING -------------------- */

  const filteredOrders = useMemo(() => {
    return ordersData.filter((order) => {
      if (filters.status !== "All" && order.status !== filters.status)
        return false;

      if (
        filters.orderType !== "All" &&
        order.orderType !== filters.orderType
      )
        return false;

      if (filters.search.trim()) {
        const q = filters.search.toLowerCase();
        const text =
          order.id +
          order.customer.name +
          order.customer.service +
          order.orderType;

        if (!text.toLowerCase().includes(q)) return false;
      }

      if (filters.date) {
        const orderDate = new Date(order.time)
          .toISOString()
          .split("T")[0];
        if (orderDate !== filters.date) return false;
      }

      return true;
    });
  }, [filters]);

  /* -------------------- SUMMARY COUNTS -------------------- */

  const summaryCounts = useMemo(() => {
    return {
      total: filteredOrders.length,
      pending: filteredOrders.filter((o) => o.status === "Pending").length,
      completed: filteredOrders.filter((o) => o.status === "Completed").length,
      failed: filteredOrders.filter((o) => o.status === "Failed").length,
    };
  }, [filteredOrders]);

  /* -------------------- PAGINATION -------------------- */

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredOrders.slice(start, start + PAGE_SIZE);
  }, [filteredOrders, currentPage]);

  /* -------------------- DESKTOP TABLE TRANSFORM -------------------- */

  const desktopOrders: RecentOrder[] = useMemo(() => {
    return paginatedOrders.map((order) => ({
      orderId: order.id,
      customer: {
        name: order.customer.name,
        email: "—",
        avatar: order.customer.avatar,
      },
      type: order.orderType.includes("Store") ? "Store" : "Shop",
      currency: "USD",
      amount: order.price,
      status: order.status,
      date: order.time,
    }));
  }, [paginatedOrders]);

  /* -------------------- HANDLERS -------------------- */

  const updateFilters = (next: Partial<OrderFiltersState>) => {
    setCurrentPage(1);
    setFilters((prev) => ({ ...prev, ...next }));
  };

  /* -------------------- RENDER -------------------- */

  return (
    <Layout title="Orders" description="View all store orders.">
      {/* MOBILE */}
      <OrdersMobileView
        orders={paginatedOrders}
        activeTab={filters.status}
        setActiveTab={(status: NameType) => updateFilters({ status })}
        summaryCounts={summaryCounts}
        filters={filters}
        onFiltersChange={updateFilters}
      />

      {/* DESKTOP */}
      <OrdersDesktopView
        filters={filters}
        onFiltersChange={updateFilters}
        orders={desktopOrders}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        summaryCounts={summaryCounts}
      />
    </Layout>
  );
};

export default OrdersPage;
