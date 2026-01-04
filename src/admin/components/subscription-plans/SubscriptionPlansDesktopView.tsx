import { useState } from "react";
import { Pagination } from "@/components/ui/Pagination";
import { paginate } from "@/utils/paginate";
import type { SubscriptionPlan } from "@/types";
import SubscriptionPlanActions from "./SubscriptionPlanActions";
import { getCurrencySymbol } from "@/_docs/doc";

interface SubscriptionPlansDesktopViewProps {
  plans: SubscriptionPlan[];
  handleAction: (uid: string, action: "Delete" | "Edit") => void;
}

export default function SubscriptionPlansDesktopView({
  plans,
  handleAction,
}: SubscriptionPlansDesktopViewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [plansPerPage, setPlansPerPage] = useState(20);

  const { data: paginatedPlans } = paginate(plans, currentPage, plansPerPage);

  return (
    <div>
      <div className="overflow-x-auto border border-gray-200 rounded-lg bg-white">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600 bg-gray-50">
              <th className="p-3 font-semibold">Plan Name</th>
              <th className="p-3 font-semibold">Price</th>
              <th className="p-3 font-semibold">Interval</th>
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
                <td className="p-3">
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
                <td className="p-3">
                  <span className="font-medium text-gray-900">
                    {getCurrencySymbol(plan.currency)}{plan.price}
                  </span>
                </td>
                <td className="p-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      plan.interval === "MONTHLY"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {plan.interval === "MONTHLY" ? "Monthly" : "Yearly"}
                  </span>
                </td>
                <td className="p-3 text-gray-700">
                  {plan.features.stores || "Unlimited"}
                </td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      plan.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {plan.status}
                  </span>
                </td>
                <td className="p-3 text-gray-700">
                  {new Date(plan.createdAt).toLocaleDateString()}
                </td>
                <td className="p-3">
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
        totalItems={plans.length}
        itemsPerPage={plansPerPage}
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => {
          setPlansPerPage(size);
          setCurrentPage(1);
        }}
      />
    </div>
  );
}
