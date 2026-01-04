import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/admin/components/Layout";
import PaymentTabs from "@/admin/components/payments/PaymentTabs";
import PaymentsSection from "@/admin/components/payments/PaymentsSection";
import TransactionsSection from "@/admin/components/payments/TransactionsSection";
import SubscriptionsSection from "@/admin/components/payments/SubscriptionsSection";

const PaymentsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");

  // Get tab from URL or default to "payments"
  const activeTab = useMemo(() => {
    return searchParams.get("tab") || "payments";
  }, [searchParams]);

  // Handle tab change and update URL
  const handleTabChange = (tab: string) => {
    setSearchParams({ tab }, { replace: true });
  };

  // Handle search change
  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  return (
    <Layout
      title="Payments & Transactions"
      description="Monitor payments, subscriptions, and transaction history."
    >
      <div className="py-5 px-6 w-full">
        {/* Tabs */}
        <PaymentTabs activeTab={activeTab} onChange={handleTabChange} />

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "payments" && (
            <PaymentsSection
              search={search}
              onSearchChange={handleSearchChange}
            />
          )}
          {activeTab === "transactions" && (
            <TransactionsSection
              search={search}
              onSearchChange={handleSearchChange}
            />
          )}
          {activeTab === "subscriptions" && (
            <SubscriptionsSection
              search={search}
              onSearchChange={handleSearchChange}
            />
          )}
        </motion.div>
      </div>
    </Layout>
  );
};

export default PaymentsPage;
