import PricingPlanCard from "../pricing/PricingPlanCard";
import PricingToggle from "../pricing/PricingToggle";
import { motion } from "framer-motion";
import type { Subscription, SubscriptionPlan } from "@/types";
import { useState } from "react";
import { useGetUserActiveSubscription } from "@/hooks/use-subscription";

interface PlansTabProps {
  currentSubscription: Subscription | null | undefined;
  subscriptionPlans: SubscriptionPlan[];
}
function PlansTab({
  currentSubscription: _,
  subscriptionPlans,
}: PlansTabProps) {
  const { data: subscription } = useGetUserActiveSubscription();
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-4">
        <div>
          <h2 className="inter text-2xl font-bold text-gray-900 mb-2">
            Choose Your Perfect Plan
          </h2>
          <p className="text-gray-600">
            Scale your business with the right features for your needs.
          </p>
        </div>
        <PricingToggle isAnnual={isAnnual} setIsAnnual={setIsAnnual} />
      </div>

      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subscriptionPlans.map((plan, index) => {
          return (
            <PricingPlanCard
              key={plan.id}
              plan={plan}
              index={index}
              currentSubscription={subscription}
              isAnnual={isAnnual}
            />
          );
        })}
      </div>
    </motion.div>
  );
}

export default PlansTab;
