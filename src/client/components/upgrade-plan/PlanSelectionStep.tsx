import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import PricingFeatures from "../pricing/PricingFeatures";
import type { SubscriptionPlan } from "@/types";
import {
  useCurrencyConverter,
  type CurrencyCode,
} from "@/lib/currencyConverter";
import { useNavigate } from "react-router-dom";
import Decimal from "decimal.js";
import PricingToggle from "../pricing/PricingToggle";

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
  const navigate = useNavigate();

  const months = isAnnual ? 12 : 1;
  const discountRate = isAnnual ? selectedPlan.discountForAnnually || 0 : 0;

  const basePrice = new Decimal(selectedPlan.price).mul(months).toFixed(2);
  const discountAmount = discountRate
    ? new Decimal(basePrice).mul(new Decimal(discountRate)).div(100).toFixed(2)
    : "0.00";

  const discountedTotal = new Decimal(basePrice)
    .minus(new Decimal(discountAmount))
    .toFixed(2);
  const payableToday = getDiscountedPrice();

  const displayBase = convert(
    selectedPlan.currency,
    userCurrency,
    basePrice,
    true,
    false
  ).formatted;

  const displayDiscount = convert(
    selectedPlan.currency,
    userCurrency,
    discountAmount,
    true,
    false
  ).formatted;

  const displayDiscounted = convert(
    selectedPlan.currency,
    userCurrency,
    discountedTotal,
    true,
    false
  ).formatted;

  const displayPayable = convert(
    selectedPlan.currency,
    userCurrency,
    payableToday,
    true,
    false
  ).formatted;
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
      <PricingToggle isAnnual={isAnnual} setIsAnnual={setIsAnnual} />

      {/* DISCOUNT BANNER */}
      {isAnnual && annualDiscount && (
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
                Get {selectedPlan.discountForAnnually}% off when billed
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
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {selectedPlan.name}
            </h3>
            <p className="text-xs uppercase text-gray-500 tracking-wide">
              {selectedPlan.description}
            </p>
          </div>
          {annualDiscount && isAnnual && (
            <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
              Save {selectedPlan.discountForAnnually}%
            </span>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="inter text-sm text-gray-600">Plan price</span>
            <span className="poppins font-semibold text-gray-900">
              {displayBase}
            </span>
          </div>

          {discountRate > 0 && (
            <div className="flex items-center justify-between mb-2">
              <span className="inter text-sm text-gray-600">
                Annual discount
              </span>
              <span className="poppins font-semibold text-green-700">
                - {displayDiscount}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-dashed border-gray-200 pt-3 mt-2">
            <span className="inter text-sm text-gray-600">Subtotal</span>
            <span className="poppins font-semibold text-gray-900">
              {displayDiscounted}
            </span>
          </div>

          <div className="flex items-center justify-between mt-3">
            <div>
              <p className="text-xs text-gray-500 uppercase">
                Due today (before tax)
              </p>
              <p className="text-[11px] text-gray-400">
                Upgrade differences are applied automatically
              </p>
            </div>
            <p className="poppins text-3xl font-bold text-primary">
              {displayPayable}
            </p>
          </div>
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
