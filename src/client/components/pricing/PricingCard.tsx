import { mockPlans } from "@/_docs/doc";
import type { PricingCardProps } from "../../../types/Pricing.types";
import PricingPlanCard from "./PricingPlanCard";

function PricingCard({ isAnnual }: PricingCardProps) {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 grid gap-6">
      {mockPlans.map((plan, index) => (
        <PricingPlanCard
          key={plan.id}
          plan={plan}
          isAnnual={isAnnual}
          index={index}
        />
      ))}
    </div>
  );
}

export default PricingCard;
