import { useState } from "react";
import { Pagination } from "@/components/ui/Pagination";
import { paginate } from "@/utils/paginate";
import type { SubscriptionPlan } from "@/types";
import SubscriptionPlanActions from "./SubscriptionPlanActions";

interface SubscriptionPlansDesktopViewProps {
  plans: SubscriptionPlan[];
  handleAction: (uid: string, action: "Delete" | "Edit") => void;
}

export default function SubscriptionPlansDesktopView({
  plans,
  handleAction,
}: SubscriptionPlansDesktopViewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [plansPerPage] = useState(20);

  const { data: paginatedPlans } = paginate(plans, currentPage, plansPerPage);

  return (
    <div>
      <div className="overflow-x-auto border border-gray-200 rounded-[4px] bg-white">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600 bg-gray-50">
              <th className="p-3 font-semibold">Plan Name</th>
              <th className="p-3 font-semibold">Pricing</th>
              <th className="p-3 font-semibold">Stores</th>
              <th className="p-3 font-semibold">Status</th>
              <th className="p-3 font-semibold">Created</th>
              <th className="p-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPlans.map((plan) => (
              <tr
                key={plan.id}
                className="border-t border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <td className="p-3 align-top">
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-900">
                      {plan.name}
                    </span>
                    {plan.description && (
                      <span className="text-xs text-gray-500 mt-1 inter">
                        {plan.description.substring(0, 50).toUpperCase()}...
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-3 align-top">
                  {plan.prices && plan.prices.length > 0 ? (
                    <span className="text-sm font-medium text-gray-700">
                      {plan.prices.length}{" "}
                      {plan.prices.length === 1 ? "price" : "prices"} configured
                    </span>
                  ) : (
                    <span className="text-gray-400 italic text-sm">
                      No prices
                    </span>
                  )}
                </td>
                <td className="p-3 align-top text-gray-700">
                  {plan.features.stores || "Unlimited"}
                </td>
                <td className="p-3 align-top">
                  <span
                    className={`px-2 py-1 rounded-[4px] text-xs font-medium ${
                      plan.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {plan.status}
                  </span>
                </td>
                <td className="p-3 align-top text-gray-700">
                  {new Date(plan.createdAt).toLocaleDateString()}
                </td>
                <td className="p-3 align-top">
                  <SubscriptionPlanActions
                    handleAction={handleAction}
                    plan={plan}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        itemsPerPage={plansPerPage}
        totalItems={plans.length}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
