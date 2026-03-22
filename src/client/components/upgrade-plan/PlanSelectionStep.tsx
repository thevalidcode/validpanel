import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import PricingFeatures from "../pricing/PricingFeatures";
import type { SubscriptionPlan } from "@/types";
import {
  useCurrencyConverter,
  type CurrencyCode,
} from "@/lib/currencyConverter";
import PricingToggle from "../pricing/PricingToggle";
import { resolvePlanPrice } from "@/utils/subscription-pricing.utils";

interface PlanSelectionStepProps {
  selectedPlan: SubscriptionPlan;
  isAnnual: boolean;
  setIsAnnual: (v: boolean) => void;
  annualDiscount: boolean;
  userCurrency: CurrencyCode;
  getDiscountedPrice: () => string;
  setCurrentStep: (page: number) => void;
}

function PlanSelectionStep({
  selectedPlan,
  isAnnual,
  setIsAnnual,
  annualDiscount,
  userCurrency,
  getDiscountedPrice,
  setCurrentStep,
}: PlanSelectionStepProps) {
  const convert = useCurrencyConverter();

  const currentInterval = isAnnual ? "YEARLY" : "MONTHLY";
  const targetCurrency = userCurrency || "USD";
  const resolvedPrice = resolvePlanPrice(
    selectedPlan,
    currentInterval,
    targetCurrency,
  );
  const baseCurrency = resolvedPrice.currency;
  const baseAmount = resolvedPrice.amount.toFixed(2);

  const payableToday = getDiscountedPrice();

  const displayBase = convert(
    baseCurrency,
    userCurrency,
    baseAmount.toString(),
    true,
    false,
  ).formatted;

  const displayPayable = convert(
    baseCurrency,
    userCurrency,
    payableToday,
    true,
    false,
  ).formatted;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <div className="bg-white rounded-[4px] border border-gray-200 p-6 mb-6">
        <h2 className="inter text-xl font-bold text-gray-900 mb-4">
          Review Plan Details
        </h2>

        {/* Toggle Annual/Monthly */}
        <div className="flex items-center gap-4 mb-6">
          <PricingToggle isAnnual={isAnnual} setIsAnnual={setIsAnnual} />
          {annualDiscount && (
            <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
              Annual savings available
            </span>
          )}
        </div>

        <div className="flex flex-col md:flex-row justify-between mb-8 pb-8 border-b border-gray-100">
          <div>
            <h3 className="poppins text-lg font-bold text-gray-900">
              {selectedPlan.name}
            </h3>
            <p className="inter text-sm text-gray-500 mt-1">
              {selectedPlan.description}
            </p>
          </div>
          <div className="text-right mt-4 md:mt-0">
            <div className="poppins text-3xl font-bold text-gray-900">
              {displayBase}
            </div>
            <p className="inter text-sm text-gray-500">
              billed {isAnnual ? "yearly" : "monthly"}
            </p>
          </div>
        </div>

        <h4 className="inter text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
          Included Features
        </h4>
        <PricingFeatures plan={selectedPlan} />
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-[4px] p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-blue-600" />
          <div>
            <p className="inter text-sm font-medium text-blue-900">
              Due Today (Prorated)
            </p>
            <p className="inter text-xs text-blue-700">
              Includes adjustments for your current plan
            </p>
          </div>
        </div>
        <span className="poppins text-lg font-bold text-blue-900">
          {displayPayable}
        </span>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={() => setCurrentStep(2)}
          className="bg-primary text-white px-6 py-2.5 rounded-[4px] font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          Proceed to Payment
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

export default PlanSelectionStep;
