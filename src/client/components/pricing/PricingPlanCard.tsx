import type { SubscriptionPlan } from "@/types/models/subscription-plan";
import { motion } from "framer-motion";

function PricingPlanCard({
  plan,
  isAnnual,
  index,
}: {
  plan: SubscriptionPlan;
  isAnnual: boolean;
  index: number;
}) {
  const monthlyPrice = parseFloat(plan.price);
  const displayPrice = isAnnual
    ? (monthlyPrice * 12).toFixed(0)
    : monthlyPrice.toFixed(0);
  const formatFeatureKey = (key: string): string => {
    return key
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };
  const formatFeatureValue = (key: string, value: any): string => {
    if (typeof value === "boolean") {
      return value ? formatFeatureKey(key) : "";
    }
    if (key.includes("stores")) {
      return `Launch ${value} stores`;
    }
    if (key.includes("products")) {
      return `Upload ${value} products`;
    }
    return `${formatFeatureKey(key)}: ${value}`;
  };
  const features = Object.entries(plan.features)
    .filter(([_, value]) => value)
    .map(([key, value]) => formatFeatureValue(key, value))
    .filter(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="w-full"
    >
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md shadow-primary transition-all duration-300 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Left Section */}
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {plan.name}
            </h3>
            <p className="text-xs uppercase text-gray-500 tracking-wide mb-6">
              {plan.description}
            </p>

            <ul className="space-y-3 mb-4">
              {features.map((feature, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <svg
                    className="w-5 h-5 text-purple-600 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700 text-sm">{feature}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Right Section */}
          <div className="flex flex-col items-center lg:items-end gap-4 lg:min-w-[200px]">
            <div className="text-center lg:text-right">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                Starting at
              </p>
              <div className="flex items-baseline justify-center lg:justify-end gap-1">
                <span className="text-4xl font-bold text-gray-900">
                  ${displayPrice}
                </span>
                <span className="text-sm text-gray-500 font-medium">USD</span>
              </div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">
                {isAnnual ? "per year" : "per month"}
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full lg:w-auto px-8 poppins py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              Upgrade Now
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default PricingPlanCard;
