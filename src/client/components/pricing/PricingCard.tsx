import type { SubscriptionPlan } from "@/types/models/subscription-plan";
import type { PricingCardProps } from "../../../types/Pricing.types";
import PricingPlanCard from "./PricingPlanCard";

export const mockPlans: SubscriptionPlan[] = [
  {
    id: 1,
    uid: "free-plan-001",
    name: "Free Plan",
    price: "0",
    currency: "USD",
    description: "ideal for testing or new sellers",
    status: "ACTIVE",
    features: {
      launch_stores: "1",
      upload_products: "up to 10",
      onboarding_tools: true,
    },
    interval: "MONTHLY",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    uid: "standard-plan-001",
    name: "Standard Plan",
    price: "20",
    currency: "USD",
    description: "right for small businesses",
    status: "ACTIVE",
    features: {
      launch_stores: "up to 5",
      unlimited_products: true,
      custom_branding: true,
    },
    interval: "MONTHLY",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    uid: "pro-plan-001",
    name: "Pro Plan",
    price: "40",
    currency: "USD",
    description: "for full-time digital entrepreneurs",
    status: "ACTIVE",
    features: {
      launch_stores: "unlimited",
      unlimited_products: true,
      priority_support: true,
      store_analytics: true,
      custom_branding: true,
    },
    interval: "MONTHLY",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 4,
    uid: "business-plan-001",
    name: "Business Plan",
    price: "80",
    currency: "USD",
    description: "for growing enterprises",
    status: "ACTIVE",
    features: {
      launch_stores: "unlimited",
      unlimited_products: true,
      priority_support: true,
      store_analytics: true,
      custom_branding: true,
      api_access: true,
      white_label: true,
    },
    interval: "MONTHLY",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 5,
    uid: "empire-plan-001",
    name: "Empire Plan",
    price: "150",
    currency: "USD",
    description: "for large scale operations",
    status: "ACTIVE",
    features: {
      launch_stores: "unlimited",
      unlimited_products: true,
      priority_support: true,
      store_analytics: true,
      custom_branding: true,
      api_access: true,
      white_label: true,
      dedicated_account_manager: true,
      custom_integrations: true,
    },
    interval: "MONTHLY",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

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
