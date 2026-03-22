import { useState, type FC } from "react";
import { Edit2Icon, MoreVertical, Trash } from "lucide-react";
import ActionMenu from "@/components/ui/ActionMenu";
import type { SubscriptionPlan } from "@/types";

interface SubscriptionPlansMobileViewProps {
  plans: SubscriptionPlan[];
  handleAction: (uid: string, action: "Delete" | "Edit") => void;
}

const SubscriptionPlansMobileView: FC<SubscriptionPlansMobileViewProps> = ({
  plans,
  handleAction,
}) => {
  const [visibleCount, setVisibleCount] = useState(10);

  const visiblePlans = plans.slice(0, visibleCount);
  const hasMore = visibleCount < plans.length;

  const onHandleLoadMore = () => setVisibleCount((prev) => prev + 10);

  return (
    <div className="w-full space-y-3">
      {visiblePlans.map((plan) => (
        <div
          key={plan.id}
          className="border border-t-4 border-primary border-t-primary rounded-[4px] py-5 px-[17px] hover:border-primary/70 transition-all shadow-sm"
        >
          <div className="space-y-4">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                {plan.description && (
                  <p className="text-xs text-gray-500 mt-1 inter">
                    {plan.description.substring(0, 60).toUpperCase()}...
                  </p>
                )}
              </div>
              <ActionMenu
                icon={<MoreVertical className="text-gray-400" />}
                items={[
                  {
                    label: "Delete",
                    icon: <Trash className="w-4 h-4 text-red-700" />,
                    onClick: () => handleAction(plan.uid, "Delete"),
                  },
                  {
                    label: "Edit",
                    icon: <Edit2Icon className="w-4 h-4 text-blue-700" />,
                    onClick: () => handleAction(plan.uid, "Edit"),
                  },
                ]}
              />
            </div>

            {/* Pricing Summary */}
            <div className="bg-gray-50 rounded-[4px] px-3 py-2 flex flex-col gap-1">
              <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                Pricing Options
              </span>
              {plan.prices && plan.prices.length > 0 ? (
                <span className="text-sm font-semibold text-gray-900">
                  {plan.prices.length}{" "}
                  {plan.prices.length === 1 ? "price" : "prices"} found
                </span>
              ) : (
                <span className="text-sm text-gray-400 italic">No pricing configured</span>
              )}
            </div>

            {/* Features */}
            <div className="bg-gray-50 rounded-[4px] px-3 py-2">
              <p className="text-xs text-gray-600 mb-2">Features</p>
              <div className="flex gap-2 flex-wrap">
                {plan.features.stores && (
                  <span className="text-xs bg-white border border-gray-200 rounded px-2 py-1">
                    {plan.features.stores} stores
                  </span>
                )}
                {plan.features.unlimited_products && (
                  <span className="text-xs bg-white border border-gray-200 rounded px-2 py-1">
                    Unlimited products
                  </span>
                )}
                {plan.features.api_access && (
                  <span className="text-xs bg-white border border-gray-200 rounded px-2 py-1">
                    API Access
                  </span>
                )}
                {plan.features.custom_domain && (
                  <span className="text-xs bg-white border border-gray-200 rounded px-2 py-1">
                    Custom domain
                  </span>
                )}
              </div>
            </div>

            {/* Status & Created */}
            <div className="flex items-center gap-4 text-xs text-gray-600">
              <span
                className={`px-2 py-1 rounded-full font-medium ${
                  plan.status === "ACTIVE"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {plan.status}
              </span>
              <span>{new Date(plan.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      ))}
      {hasMore && (
        <button
          onClick={onHandleLoadMore}
          className="w-full py-2 text-sm text-primary font-medium hover:bg-primary/5 rounded transition-colors"
        >
          Load More
        </button>
      )}
    </div>
  );
};

export default SubscriptionPlansMobileView;
