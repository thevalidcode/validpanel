import { motion } from "framer-motion";
import { useGetUserSubscriptionPlans } from "@/hooks/use-subscription-plan";
import Loader from "@/components/Loader";
import NotFound from "@/components/NotFound";
import { formatPlanFeatures } from "@/utils/subscription-plan.utils"; // your helper
import type { SubscriptionPlanFeatures } from "@/types";

function PricingTable() {
  const { data: subscriptionPlans, isLoading } = useGetUserSubscriptionPlans();

  if (isLoading) return <Loader />;
  if (!subscriptionPlans || subscriptionPlans.length === 0)
    return <NotFound title="No subscription plan found" variant="page" />;

  // Generate dynamic tableData from subscriptionPlans
  const tableData = (() => {
    // Collect all possible features
    const allFeatureKeys = Array.from(
      new Set(subscriptionPlans.flatMap((plan) => Object.keys(plan.features)))
    ) as (keyof SubscriptionPlanFeatures)[];

    return allFeatureKeys.map((key) => {
      const row: Record<string, string | boolean> = {
        feature: formatPlanFeatures({ [key]: "_" })[0] || key,
      };
      subscriptionPlans.forEach((plan) => {
        const value = plan.features[key];

        // If boolean feature, keep as boolean
        if (typeof value === "boolean") {
          row[plan.uid] = value;
        } else if (typeof value === "number") {
          row[plan.uid] = value.toString();
        } else if (value === null || value === undefined) {
          row[plan.uid] = false; // treat null/undefined as not available
        } else {
          row[plan.uid] = value;
        }
      });
      return row;
    });
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-16"
    >
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
        Compare plan & <span className="text-purple-600">features</span>
      </h2>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                  Features
                </th>
                {subscriptionPlans.map((plan) => (
                  <th
                    key={plan.uid}
                    className="text-center py-4 px-6 text-sm font-semibold text-gray-700"
                  >
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-6 text-sm text-gray-700 font-medium">
                    {row.feature}
                  </td>
                  {subscriptionPlans.map((plan) => {
                    const value = row[plan.uid];
                    return (
                      <td key={plan.uid} className="py-4 px-6 text-center">
                        {typeof value === "boolean" ? (
                          value ? (
                            <svg
                              className="w-5 h-5 text-purple-600 mx-auto"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <span className="text-gray-300">-</span>
                          )
                        ) : (
                          <span className="text-sm text-gray-700">{value}</span>
                        )}
                      </td>
                    );
                  })}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

export default PricingTable;
