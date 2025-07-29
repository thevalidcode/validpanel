import type { Plan, PricingCardProps } from "../../../types/Pricing.types";
import PricingPlanCard from "./PricingPlanCard";

const plans: Plan[] = [
  {
    name: "Free Plan",
    monthly: 0,
    annually: 0,
    idealFor: "ideal for testing or new sellers",
    features: ["Launch 1 store", "Upload up to 10 products", "Access Onboarding tools"],
    buttonText: "Start Free",
    link: "#",
  },
  {
    name: "Standard Plan",
    monthly: 19,
    annually: 190,
    idealFor: "right for small businesses",
    features: ["Launch up to 5 stores", "Unlimited products", "Custom branding"],
    buttonText: "Upgrade Now",
    link: "#",
  },
  {
    name: "Pro Plan",
    monthly: 49,
    annually: 490,
    idealFor: "for full-time digital entrepreneurs",
    features: ["Unlimited stores", "Priority Support", "Store analytics"],
    buttonText: "Upgrade Now",
    link: "#",
  },
];

function PricingCard({ isAnnual }: PricingCardProps) {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 grid gap-6">
      {plans.map((plan, index) => (
        <PricingPlanCard key={index} plan={plan} isAnnual={isAnnual} />
      ))}
    </div>
  );
}

export default PricingCard;