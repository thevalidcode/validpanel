import PricingPlanCard from "../pricing/PricingPlanCard";
import { motion } from "framer-motion";
import type { Subscription, SubscriptionPlan } from "@/types";

interface PlansTabProps {
  subscription: Subscription;
  subscriptionPlans: SubscriptionPlan[];
}
function PlansTab({ subscription, subscriptionPlans }: PlansTabProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6">
        <h2 className="inter text-2xl font-bold text-gray-900 mb-2">
          Choose Your Perfect Plan
        </h2>
        <p className="text-gray-600">
          Scale your business with the right features for your needs
        </p>
      </div>

      <div className="w-full max-w-7xl mx-auto grid gap-6">
        {subscriptionPlans.map((plan, index) => {
          return (
            <PricingPlanCard
              key={plan.id}
              plan={plan}
              index={index}
              currentSubscription={subscription}
            />
          );
        })}
      </div>
    </motion.div>
  );
}

export default PlansTab;
