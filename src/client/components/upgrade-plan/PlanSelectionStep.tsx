import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import PricingFeatures from "../pricing/PricingFeatures";
import type { SubscriptionPlan, SubscriptionPlanInterval } from "@/types";
import {
  useCurrencyConverter,
  type CurrencyCode,
} from "@/lib/currencyConverter";
import { useNavigate } from "react-router-dom";

interface PlanSelectionStepProps {
  selectedPlan: SubscriptionPlan;
  billingCycle: SubscriptionPlanInterval;
  setBillingCycle: (v: SubscriptionPlanInterval) => void;
  annualDiscount: boolean;
  userCurrency: CurrencyCode;
  getDiscountedPrice: () => string;
  setCurrentStep: (page: number) => void;
}

function PlanSelectionStep({
  selectedPlan,
  billingCycle,
  setBillingCycle,
  annualDiscount,
  userCurrency,
  getDiscountedPrice,
  setCurrentStep,
}: PlanSelectionStepProps) {
  const convert = useCurrencyConverter();
  const navigate = useNavigate();
  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white rounded-2xl border border-gray-200 p-6"
    >
      <h2 className="poppins text-xl font-bold text-gray-900 mb-6">
        Selected Plan
      </h2>

      {/* BILLING CYCLE SWITCH */}
      <div className="relative w-fit bg-gray-100 rounded-2xl p-1 mb-6 shadow-inner">
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="absolute top-1 bottom-1 w-1/2 rounded-xl bg-white shadow-lg"
          style={{
            left: billingCycle === "MONTHLY" ? "4px" : "calc(48%)",
          }}
        />

        <div className="relative z-10 flex">
          <button
            onClick={() => setBillingCycle("MONTHLY")}
            className={`w-24 py-2 text-sm font-semibold ${
              billingCycle === "MONTHLY"
                ? "text-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Monthly
          </button>

          <button
            onClick={() => setBillingCycle("YEARLY")}
            className={`w-24 py-2 text-sm font-semibold ${
              billingCycle === "YEARLY"
                ? "text-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Annual
          </button>
        </div>
      </div>

      {/* DISCOUNT BANNER */}
      {billingCycle === "YEARLY" && annualDiscount && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-xl p-4 mb-6 border border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 shadow-sm"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-primary/20 p-2 rounded-lg">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-primary">
                Get {selectedPlan.discountForAnnually} percent off when billed
                annually.
              </p>
              <p className="text-xs text-primary/70 mt-1">
                Best choice for long term users who want maximum savings.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* PLAN CARD */}
      <div className="rounded-xl border border-gray-300 bg-gray-50 p-6 mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-1">
          {selectedPlan.name}
        </h3>
        <p className="text-xs uppercase text-gray-500 tracking-wide mb-4">
          {selectedPlan.description}
        </p>

        <div className="text-right mb-4">
          <p className="poppins text-3xl font-bold text-gray-900">
            {
              convert(
                selectedPlan.currency,
                userCurrency,
                getDiscountedPrice(),
                true,
                false
              ).formatted
            }
          </p>
          <p className="text-xs text-gray-500 uppercase">
            {billingCycle === "YEARLY" ? "per year" : "per month"}
          </p>
        </div>

        <PricingFeatures plan={selectedPlan} />
      </div>

      <div className="flex items-center space-x-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate(-1)}
          className="flex-1 border-2 text-sm border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:border-gray-400"
        >
          Back
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setCurrentStep(2)}
          className="flex-1 bg-primary text-sm text-white py-3 px-6 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:bg-primary/90"
        >
          <span>Continue to Payment</span>
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.div>
  );
}

export default PlanSelectionStep;
