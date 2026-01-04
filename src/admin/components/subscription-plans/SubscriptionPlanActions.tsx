import type { SubscriptionPlan } from "@/types";
import { Edit, TrashIcon } from "lucide-react";

function SubscriptionPlanActions({
  handleAction,
  plan,
}: {
  plan: SubscriptionPlan;
  handleAction: (uid: string, action: "Delete" | "Edit") => void;
}) {
  return (
    <div className="flex gap-2">
      <button
        title="Edit"
        onClick={() => handleAction(plan.uid, "Edit")}
        className="text-blue-700 hover:text-blue-900 transition"
      >
        <Edit className="w-5 h-5" />
      </button>
      <button
        title="Delete"
        onClick={() => handleAction(plan.uid, "Delete")}
        className="text-red-600 hover:text-red-800 transition"
      >
        <TrashIcon className="w-5 h-5" />
      </button>
    </div>
  );
}

export default SubscriptionPlanActions;
