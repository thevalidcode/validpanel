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
  TrendingUp,
  AlertTriangle,
  Receipt,
  AlertOctagon,
} from "lucide-react";
import type { Subscription, SubscriptionStatus } from "@/types";
import PricingFeatures from "../pricing/PricingFeatures";
import { useAppContext } from "@/context/useAppContext";
import { useCurrencyConverter } from "@/lib/currencyConverter";
import { useNavigate } from "react-router-dom";
import { resolvePlanPrice } from "@/utils/subscription-pricing.utils";

interface OverviewTabProps {
  subscription: Subscription;
  setActiveTab: (page: string) => void;
}

function OverviewTab({ subscription, setActiveTab }: OverviewTabProps) {
  const { userCurrency } = useAppContext();
  const convert = useCurrencyConverter();
  const navigate = useNavigate();

  const daysRemaining = subscription.expiresAt
    ? getDaysRemaining(subscription.expiresAt)
    : Infinity;

  // Determine reminder urgency based on expiration and grace period
  const getReminderLevel = () => {
    // If status is PAST_DUE or explicitly in grace period logic
    if (subscription.status === "PAST_DUE") {
      return "grace";
    }

    if (subscription.status === "EXPIRED") {
      return "expired";
    }

    if (daysRemaining <= 0) return "expired";
    if (daysRemaining <= 3) return "critical"; // 3 days or less
    if (daysRemaining <= 7) return "warning"; // 7 days or less
    return null;
  };

  const reminderLevel = getReminderLevel();

  const showRenewButton =
    reminderLevel !== null ||
    subscription.status === "PAST_DUE" ||
    subscription.status === "EXPIRED" ||
    subscription.status === "CANCELED";

  const reminderContent = (() => {
    switch (reminderLevel) {
      case "expired":
        return {
          title: "Subscription Expired",
          message:
            "Your subscription has expired. Please renew immediately to restore full access.",
          color: "bg-red-50 text-red-800 border-red-200",
          icon: <AlertOctagon className="w-5 h-5 text-red-600" />,
        };
      case "grace":
        return {
          title: "Payment Past Due",
          message:
            "Your payment is past due. You are currently in a grace period. Please update your payment method or renew now to avoid service interruption.",
          color: "bg-orange-50 text-orange-800 border-orange-200",
          icon: <AlertTriangle className="w-5 h-5 text-orange-600" />,
        };
      case "critical":
        return {
          title: "Expiring Soon",
          message: `Your subscription expires in ${
            daysRemaining === 0 ? "today" : daysRemaining + " days"
          }. Renew now to keep your benefits seamlessly.`,
          color: "bg-red-50 text-red-800 border-red-200",
          icon: <Clock className="w-5 h-5 text-red-600" />,
        };
      case "warning":
        return {
          title: "Upcoming Renewal",
          message: `Your subscription will renew in ${daysRemaining} days.`,
          color: "bg-blue-50 text-blue-800 border-blue-200", // Less urgent, friendly reminder
          icon: <Calendar className="w-5 h-5 text-blue-600" />,
        };
      default:
        return null; // Don't show reminder
    }
  })();

  const currentInterval = subscription.billingCycle || "MONTHLY";
  const targetCurrency = userCurrency || "USD";
  const resolvedPrice = subscription.plan
    ? resolvePlanPrice(subscription.plan, currentInterval, targetCurrency)
    : null;
  const baseCurrency = resolvedPrice?.currency || "USD";
  const baseAmount = resolvedPrice?.amount.toFixed(2) || "0.00";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Plan Details Card */}
      <div className="bg-white rounded-[4px] border border-gray-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow duration-200">
        <AnimatePresence>
          {reminderContent && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className={`mb-6 rounded-[4px] p-4 border flex items-start gap-3 ${reminderContent.color}`}
            >
              <div className="flex-shrink-0 mt-0.5">{reminderContent.icon}</div>
              <div className="flex-1">
                <h4 className="text-sm font-bold mb-1">
                  {reminderContent.title}
                </h4>
                <p className="text-sm leading-relaxed opacity-90">
                  {reminderContent.message}
                </p>
                {/* Action in alert for urgency */}
                {(reminderLevel === "grace" ||
                  reminderLevel === "critical" ||
                  reminderLevel === "expired") && (
                  <button
                    onClick={() => navigate("/subscription/renew")}
                    className="mt-3 text-xs font-bold uppercase tracking-wide bg-white/50 hover:bg-white/80 border border-current px-3 py-1.5 rounded-[4px] transition-colors"
                  >
                    Renew Now
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="poppins text-2xl font-bold text-gray-900 mb-1">
              {subscription.plan?.name}
            </h2>
            <span
              className={`inter text-xs px-3 py-1 rounded-full border font-medium ${getStatusColor(
                subscription.status as SubscriptionStatus,
              )}`}
            >
              {subscription.status}
            </span>
            <p className="text-xs inter uppercase text-gray-500 tracking-wide mt-3">
              {subscription.plan?.description}
            </p>
          </div>

          <div className="text-right">
            <div className="poppins text-4xl font-bold text-gray-900">
              {
                convert(baseCurrency, targetCurrency, baseAmount, true, false)
                  .formatted
              }
            </div>
            <p className="inter text-sm text-gray-500">
              {currentInterval === "MONTHLY" ? "per month" : "per year"}
            </p>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 border border-gray-200 rounded-[4px] p-4">
            <div className="flex items-center space-x-3 mb-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              <span className="inter text-sm font-medium text-gray-700">
                Started On
              </span>
            </div>
            <p className="inter text-gray-900 font-semibold pl-8">
              {formatDate(subscription.startedAt)}
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-[4px] p-4">
            <div className="flex items-center space-x-3 mb-2">
              <Clock className="w-5 h-5 text-purple-600" />
              <span className="inter text-sm font-medium text-gray-700">
                Expires On
              </span>
            </div>
            <p className="inter text-gray-900 font-semibold pl-8">
              {subscription.expiresAt
                ? formatDate(subscription.expiresAt)
                : "N/A"}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 mt-auto">
          {subscription.status === "ACTIVE" && (
            <button
              onClick={() => setActiveTab("plans")}
              className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-[4px] text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              Change Plan
            </button>
          )}

          {showRenewButton && (
            <button
              onClick={() => navigate("/subscription/renew")}
              className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-[4px] text-sm font-medium hover:bg-[var(--color-primary)]/90 transition-colors flex items-center gap-2 ml-auto"
            >
              <Receipt className="w-4 h-4" />
              Renew Subscription
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Plan Features */}
      {subscription.plan && (
        <div className="bg-white rounded-[4px] border border-gray-200 p-6 h-full flex flex-col justify-start shadow-sm hover:shadow-md transition-shadow duration-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4 poppins border-b border-gray-100 pb-2">
            Active Features
          </h3>
          <PricingFeatures plan={subscription.plan} />
        </div>
      )}
    </div>
  );
}

export default OverviewTab;
