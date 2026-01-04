import { useState, useMemo } from "react";
import Layout from "@/admin/components/Layout";

import PaymentsDesktopView from "../components/payments/PaymentsDesktopView";
import PaymentsMobileView from "../components/payments/PaymentsMobileView";

import type { MobilePayment } from "../components/payments/PaymentsMobileView";
import type { PaymentRow } from "../components/payments/PaymentsTable";

/* ---------------- MOCK DATA ---------------- */

const desktopPaymentsData: PaymentRow[] = [
  {
    transactionId: "TXN-001",
    user: {
      name: "Sarah Johnson",
      avatar: "/images/desktop-3.png",
    },
    amount: "$49.99",
    status: "Completed",
    gateway: "Stripe",
    date: "2024-01-15 10:30",
  },
  {
    transactionId: "TXN-002",
    user: {
      name: "James Lim",
      avatar: "/images/desktop-3.png",
    },
    amount: "$89.99",
    status: "Processing",
    gateway: "PayPal",
    date: "2024-01-15 09:15",
  },
];

const mobilePaymentsData: MobilePayment[] = [
  {
    id: "TXN-001",
    user: {
      name: "John Smith",
      avatar: "/images/mobile-2.png",
      plan: "Premium Subscription",
    },
    method: "Bank Transfer",
    amount: "$49.99",
    status: "Pending",
  },
];

/* ---------------- COMPONENT ---------------- */

const PaymentsPage = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"All" | "Completed" | "Processing" | "Failed">("All");

  const filteredDesktopPayments = useMemo(() => {
    return desktopPaymentsData.filter((p) => {
      const matchesSearch =
        p.transactionId.toLowerCase().includes(search.toLowerCase()) ||
        p.user.name.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        status === "All" ? true : p.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [search, status]);

  return (
    <Layout
      title="Payments & Transactions"
      description="Monitor payments, subscriptions, and transaction history."
    >
      <PaymentsMobileView payments={mobilePaymentsData} />

      <PaymentsDesktopView
        payments={filteredDesktopPayments}
        search={search}
        status={status}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
      />
    </Layout>
  );
};

export default PaymentsPage;
