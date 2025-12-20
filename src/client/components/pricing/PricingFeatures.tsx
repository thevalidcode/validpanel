import type { SubscriptionPlan } from "@/types";
import { formatPlanFeatures } from "@/utils/subscription-plan.utils";
import { motion } from "framer-motion";

function PricingFeatures({ plan }: { plan: SubscriptionPlan }) {
  const features = formatPlanFeatures(plan.features);

  return (
    <div>
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
  );
}

export default PricingFeatures;
