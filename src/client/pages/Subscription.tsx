import Layout from "../components/Layout";
import { useState, type JSX } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  TrendingUp,
  CheckCircle2,
  Clock,
  ArrowRight,
  Receipt,
  Download,
  AlertCircle,
} from "lucide-react";
import {
  mockPaymentHistory,
  mockPlans,
  mockUserSubscription,
} from "@/_docs/doc";
import PricingPlanCard from "../components/pricing/PricingPlanCard";
import PricingFeatures from "../components/pricing/PricingFeatures";

// Status Types
type SubscriptionStatus =
  | "ACTIVE"
  | "PENDING"
  | "EXPIRED"
  | "TRIAL"
  | "CANCELED";

type PaymentStatus = "SUCCESS" | "PENDING" | "FAILED";

const Subscription = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const subscription = mockUserSubscription;

  // Format Date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Days Remaining
  const getDaysRemaining = (expiresAt: string): number => {
    const today = new Date();
    const expiry = new Date(expiresAt);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Status Color
  const getStatusColor = (status: SubscriptionStatus): string => {
    const colors: Record<SubscriptionStatus, string> = {
      ACTIVE: "bg-green-100 text-green-700 border-green-200",
      PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
      EXPIRED: "bg-red-100 text-red-700 border-red-200",
      TRIAL: "bg-blue-100 text-blue-700 border-blue-200",
      CANCELED: "bg-gray-100 text-gray-700 border-gray-200",
    };

    return colors[status] ?? colors.PENDING;
  };

  // Payment Status Icon
  const getPaymentStatusIcon = (status: PaymentStatus): JSX.Element => {
    if (status === "SUCCESS") {
      return <CheckCircle2 className="w-4 h-4 text-green-600" />;
    }

    if (status === "PENDING") {
      return <Clock className="w-4 h-4 text-yellow-600" />;
    }

    return <AlertCircle className="w-4 h-4 text-red-600" />;
  };

  return (
    <Layout
      title="Subscription & Billing"
      description="Manage your subscription, view billing history, and upgrade your plan"
    >
      <div className="p-6">
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {[
              { id: "overview", label: "Overview" },
              { id: "plans", label: "Plans & Pricing" },
              { id: "billing", label: "Billing History" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inter py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full"
          >
            {/* Current Subscription Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 mb-8">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="poppins text-2xl font-bold text-gray-900 mb-1">
                    {subscription.plan.name}
                  </h2>

                  <span
                    className={`inter text-xs px-3 py-1 rounded-full border font-medium ${getStatusColor(
                      subscription.status as SubscriptionStatus
                    )}`}
                  >
                    {subscription.status}
                  </span>

                  <p className="text-xs inter uppercase text-gray-500 tracking-wide mt-3">
                    {subscription.plan.description}
                  </p>
                </div>

                <div className="text-right">
                  <div className="poppins text-4xl font-bold text-gray-900">
                    ${subscription.plan.price}
                  </div>
                  <p className="inter text-sm text-gray-500">per month</p>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <span className="inter text-sm font-medium text-gray-700">
                      Started On
                    </span>
                  </div>
                  <p className="poppins text-lg font-semibold text-gray-900 ml-8">
                    {formatDate(subscription.startedAt)}
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <Clock className="w-5 h-5 text-purple-600" />
                    <span className="inter text-sm font-medium text-gray-700">
                      Renews On
                    </span>
                  </div>
                  <p className="poppins text-lg font-semibold text-gray-900 ml-8">
                    {formatDate(subscription.expiresAt)}
                    <span className="inter text-sm text-gray-500 ml-2">
                      ({getDaysRemaining(subscription.expiresAt)} days)
                    </span>
                  </p>
                </div>
              </div>

              {/* Features */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <h3 className="poppins text-lg font-semibold text-gray-900 mb-4">
                  Plan Features
                </h3>
                <PricingFeatures plan={subscription.plan} />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Upgrade */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveTab("plans")}
                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl p-6 flex items-center justify-between shadow-md hover:shadow-lg transition-all"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-white/20 p-3 rounded-lg">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="poppins font-semibold text-lg">
                      Upgrade Plan
                    </p>
                    <p className="inter text-sm text-white/90">
                      Get more features and benefits
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              {/* View Invoices */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveTab("billing")}
                className="bg-white border border-gray-200 rounded-xl p-6 flex items-center justify-between shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Receipt className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <p className="poppins font-semibold text-lg text-gray-900">
                      View Invoices
                    </p>
                    <p className="inter text-sm text-gray-600">
                      Download billing history
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Plans Tab */}
        {activeTab === "plans" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6">
              <h2 className="inter text-2xl font-bold text-gray-900 mb-2">
                Choose Your Perfect Plan
              </h2>
              <p className="text-gray-600">
                Scale your business with the right features for your needs
              </p>
            </div>

            <div className="w-full max-w-7xl mx-auto grid gap-6">
              {mockPlans.map((plan, index) => {
                return (
                  <PricingPlanCard
                    key={plan.id}
                    plan={plan}
                    index={index}
                    currentSubscription={subscription}
                  />
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Billing History Tab */}
        {activeTab === "billing" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="poppins text-xl font-bold text-gray-900">
                  Payment History
                </h2>
                <p className="inter text-sm text-gray-600 mt-1">
                  View and download all your invoices
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left inter text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left inter text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Plan
                      </th>
                      <th className="px-6 py-4 text-left inter text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-left inter text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left inter text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Invoice
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {mockPaymentHistory.map((payment, index) => (
                      <motion.tr
                        key={payment.uid}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="inter text-sm text-gray-900">
                            {formatDate(payment.createdAt)}
                          </p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="inter text-sm font-medium text-gray-900">
                            {payment.plan.name}
                          </p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="poppins text-sm font-semibold text-gray-900">
                            ${payment.amount} {payment.currency}
                          </p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            {getPaymentStatusIcon(
                              payment.status as PaymentStatus
                            )}
                            <span className="inter text-sm text-gray-700">
                              {payment.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
                          >
                            <Download className="w-4 h-4" />
                            <span className="inter text-sm font-medium">
                              Download
                            </span>
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default Subscription;
