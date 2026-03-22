import { useGetUserSubscriptionPlans } from "@/hooks/use-subscription-plan";
import Loader from "@/components/Loader";
import NotFound from "@/components/NotFound";
import { getFeatureLabel } from "@/utils/subscription-plan.utils";
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
      new Set(subscriptionPlans.flatMap((plan) => Object.keys(plan.features))),
    ) as (keyof SubscriptionPlanFeatures)[];

    return allFeatureKeys.map((key) => {
      const row: Record<string, string | boolean> = {
        feature: getFeatureLabel(key),
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
    <div className="mb-0">
      <div className="bg-white rounded-[4px] shadow-sm overflow-hidden border border-gray-200 ring-1 ring-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50">
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900 w-1/3 sticky left-0 bg-gray-50 border-r border-gray-200 z-10">
                  Features
                </th>
                {subscriptionPlans.map((plan) => (
                  <th
                    key={plan.uid}
                    className="text-center py-4 px-6 text-sm font-semibold text-gray-900 min-w-[140px] border-r border-gray-100 last:border-0"
                  >
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors group last:border-0"
                >
                  <td className="py-3 px-6 text-sm text-gray-600 font-medium sticky left-0 bg-white group-hover:bg-gray-50 transition-colors z-10 border-r border-gray-100">
                    {row.feature}
                  </td>
                  {subscriptionPlans.map((plan) => {
                    const value = row[plan.uid];
                    return (
                      <td key={plan.uid} className="py-3 px-6 text-center border-r border-gray-100 last:border-0">
                        {typeof value === "boolean" ? (
                          value ? (
                            <div className="flex justify-center">
                              <div className="text-[var(--color-primary)]">
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={2.5}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </div>
                            </div>
                          ) : (
                            <div className="flex justify-center">
                              <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                            </div>
                          )
                        ) : (
                          <span className="text-sm text-gray-900 font-medium">
                            {value}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PricingTable;
