import { useGetUserSubscriptionPlans } from "@/hooks/use-subscription-plan";
import type { PricingCardProps } from "../../../types/Pricing.types";
import PricingPlanCard from "./PricingPlanCard";
import { useGetUserActiveSubscription } from "@/hooks/use-subscription";
import Loader from "@/components/Loader";
import NotFound from "@/components/NotFound";

function PricingCard({ isAnnual }: PricingCardProps) {
  const { data: currentSubscription } = useGetUserActiveSubscription();
  const { data: subscriptionPlans, isLoading } = useGetUserSubscriptionPlans();

  if (isLoading) {
    return <Loader />;
  }

  if (!subscriptionPlans) {
    return <NotFound title="No subscription plan found" variant="page" />;
  }
  return (
    <div className="w-full max-w-7xl mx-auto px-4 grid gap-6">
      {subscriptionPlans.map((plan, index) => (
        <PricingPlanCard
          key={plan.id}
          plan={plan}
          isAnnual={isAnnual}
          index={index}
          currentSubscription={currentSubscription}
        />
      ))}
    </div>
  );
}

export default PricingCard;
