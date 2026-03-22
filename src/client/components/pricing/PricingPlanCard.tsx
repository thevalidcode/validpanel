import type { SubscriptionPlan, Subscription  } from "@/types";
import { motion } from "framer-motion";
import PricingFeatures from "./PricingFeatures";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/useAppContext";
import { useCurrencyConverter } from "@/lib/currencyConverter";
import {
  computeAnnualSavingsPercent,
  resolvePlanPrice,
} from "@/utils/subscription-pricing.utils";

interface PricingPlanCardProps {
  plan: SubscriptionPlan;
  isAnnual?: boolean;
  index: number;
  currentSubscription?: Subscription | null;
}

function PricingPlanCard({
  plan,
  isAnnual = false,
  index,
  currentSubscription,
}: PricingPlanCardProps) {
  const navigate = useNavigate();
  const { userCurrency } = useAppContext();
  const convert = useCurrencyConverter();

  const currentInterval = isAnnual ? "YEARLY" : "MONTHLY";
  const targetCurrency = userCurrency || "USD";
  const resolved = resolvePlanPrice(plan, currentInterval, targetCurrency);
  const baseCurrency = resolved.currency;
  const baseAmount = resolved.amount.toFixed(2);
  const savingsPercent = isAnnual
    ? computeAnnualSavingsPercent(plan, targetCurrency)
    : 0;


  const isSubscribed =
    !!currentSubscription &&
    currentSubscription.status === "ACTIVE" &&
    currentSubscription.plan?.uid === plan.uid &&
    currentSubscription.billingCycle === currentInterval;

  // Upgrade logic simplifies to checking price amounts roughly, 
  // but comparing different currencies is hard. 
  // We'll rely on simple logic: if it's not current plan, show switch/upgrade
  // Or just "Select Plan" if unsure. 
  // For now, let's just use "Switch to" unless it's obviously higher price.
  
  let buttonLabel = "Start Now";
  let isButtonDisabled = false;

  if (isSubscribed) {
      buttonLabel = "Current Plan";
      isButtonDisabled = true;
  } else if (currentSubscription && currentSubscription.status === "ACTIVE") {
      // Simple logic for now
      buttonLabel = "Switch to " + plan.name;
  }

  const isPopular = index === 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={`relative flex flex-col h-full bg-white rounded-[4px] p-8 transition-all duration-300 border ${
        isPopular
          ? "border-[var(--color-primary)] shadow-md ring-1 ring-[var(--color-primary)]/10"
          : "border-gray-200 shadow-sm hover:shadow-md"
      }`}
    >
      {isPopular && (
        <div className="absolute top-0 right-0 left-0 h-1 bg-[var(--color-primary)] rounded-t-[4px]" />
      )}

      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
          {isPopular && (
            <span className="text-[10px] uppercase font-bold text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-2 py-1 rounded-[4px] tracking-wide">
              Popular
            </span>
          )}
        </div>
        
        <p className="text-sm text-gray-500 min-h-[40px]">
          {plan.description || "Everything you need to grow your business."}
        </p>
      </div>

      {/* Price */}
      <div className="mb-8">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold text-gray-900 tracking-tight">
            {
              convert(
                baseCurrency,
                targetCurrency,
                baseAmount,
                true,
                false
              ).formatted
            }
          </span>
          <span className="text-gray-500 font-medium text-sm">/{isAnnual ? "year" : "month"}</span>
        </div>
        {savingsPercent > 0 && (
          <p className="text-xs text-green-600 font-medium mt-2">
            You save {savingsPercent}% with annual billing
          </p>
        )}
      </div>

      {/* CTA Button */}
      <motion.button
        disabled={isButtonDisabled}
        whileHover={!isButtonDisabled ? { y: -1 } : {}}
        whileTap={!isButtonDisabled ? { y: 0 } : {}}
        onClick={() =>
          !isButtonDisabled && navigate(`/subscription/upgrade-plan/${plan.id}`)
        }
        className={`w-full py-2.5 px-4 rounded-[4px] text-sm font-medium transition-all duration-200 mb-8 border ${
          isPopular && !isButtonDisabled
            ? "bg-[var(--color-primary)] text-white border-transparent hover:bg-[var(--color-primary)]/90 shadow-sm"
            : isButtonDisabled
            ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
            : "bg-white text-gray-900 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
        }`}
      >
        {buttonLabel}
      </motion.button>

      {/* Divider */}
      <div className="h-px bg-gray-100 mb-8 w-full" />

      {/* Features */}
      <div className="flex-1">
        <p className="text-xs font-semibold text-gray-900 uppercase tracking-widest mb-4">
          Features
        </p>
        <div className="space-y-3">
            <PricingFeatures plan={plan} />
        </div>
      </div>
    </motion.div>
  );
}

export default PricingPlanCard;
