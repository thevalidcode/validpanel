import type { Subscription, SubscriptionStatus } from "@/types";
import {
  formatDate,
  getDaysRemaining,
  getStatusColor,
} from "@/utils/subscription.utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  Clock,
  Receipt,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import PricingFeatures from "../pricing/PricingFeatures";
import { useAppContext } from "@/context/useAppContext";
import { useCurrencyConverter } from "@/lib/currencyConverter";
import { useNavigate } from "react-router-dom";

interface OverviewTabProps {
  subscription: Subscription;
  setActiveTab: (page: string) => void;
}

function OverviewTab({ subscription, setActiveTab }: OverviewTabProps) {
  const { userCurrency } = useAppContext();
  const convert = useCurrencyConverter();
  const navigate = useNavigate();

  const daysRemaining = getDaysRemaining(subscription.expiresAt!);

  // Determine reminder urgency
  const getReminderLevel = () => {
    if (
      subscription.plan.gracePeriod &&
      daysRemaining <= subscription.plan.gracePeriod
    ) {
      return "grace";
    }
    if (daysRemaining <= 1) return "critical";
    if (daysRemaining <= 3) return "high";
    if (daysRemaining <= 7) return "medium";
    return null;
  };

  const reminderLevel = getReminderLevel();

  const reminderMessage = (() => {
    switch (reminderLevel) {
      case "medium":
        return `Your plan will expire in ${daysRemaining} days. Consider renewing soon.`;
      case "high":
        return `Your plan will expire in ${daysRemaining} days. Renew now to avoid service interruption.`;
      case "critical":
        return `Your plan expires tomorrow! Renew immediately to continue enjoying your benefits.`;
      case "grace":
        return `Your plan is in grace period (${daysRemaining} days remaining). Renew to avoid service loss.`;
      default:
        return "";
    }
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      {/* Current Subscription Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 mb-8 relative">
        {/* Reminder Banner */}
        <AnimatePresence>
          {reminderLevel && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`absolute top-0 left-0 w-full rounded-t-2xl p-4 flex items-center space-x-3 ${
                reminderLevel === "critical"
                  ? "bg-red-600 text-white"
                  : reminderLevel === "high"
                  ? "bg-orange-500 text-white"
                  : reminderLevel === "medium"
                  ? "bg-yellow-400 text-gray-900"
                  : "bg-purple-100 text-purple-900"
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
              <span className="inter text-sm font-medium">
                {reminderMessage}
              </span>
              <button
                onClick={() => navigate("/subscription/renew")}
                className="ml-auto bg-white text-purple-700 px-3 py-1 rounded-lg font-medium hover:bg-gray-100 transition"
              >
                Renew Plan
              </button>
            </motion.div>
          )}
        </AnimatePresence>

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
              {
                convert(
                  subscription.plan.currency,
                  userCurrency,
                  subscription.plan.price,
                  true,
                  false
                ).formatted
              }
            </div>
            <p className="inter text-sm text-gray-500">
              {subscription.plan.interval === "MONTHLY"
                ? "per month"
                : "per year"}
            </p>
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
                ({daysRemaining} days)
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
              <p className="poppins font-semibold text-lg">Upgrade Plan</p>
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
  );
}

export default OverviewTab;
