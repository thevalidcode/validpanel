import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface Props {
  goToPlans: () => void;
}

export default function NoSubscriptionState({
  goToPlans,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 text-center mb-4"
    >
      <h2 className="poppins text-2xl font-bold text-gray-900 mb-3">
        You do not have an active subscription
      </h2>

      <p className="inter text-gray-600 mb-6">
        Choose a plan to unlock features and start using the platform.
      </p>

      <button
        onClick={goToPlans}
        className="inline-flex items-center space-x-3 bg-primary text-white px-6 py-3 rounded-[4px] font-medium hover:opacity-90 transition"
      >
        <span>View Plans</span>
        <ArrowRight className="w-5 h-5" />
      </button>
    </motion.div>
  );
}
