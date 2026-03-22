import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import type { SubscriptionPlan, PaymentGateway } from "@/types";
import {
  useCurrencyConverter,
  type CurrencyCode,
  convertCurrency,
} from "@/lib/currencyConverter";
import { useAppContext } from "@/context/useAppContext";
import Decimal from "decimal.js";
import {
  computePricingBreakdown,
  resolvePlanPrice,
} from "@/utils/subscription-pricing.utils";

interface OrderSummaryProps {
  selectedPlan: SubscriptionPlan;
  isAnnual: boolean;
  calculateTax: (amount: string) => string;
  calculateTotal: () => string;
  getDiscountedPrice: () => string;
  couponCode?: string;
  couponApplied?: boolean;
  couponDiscountAmount?: string;
  couponCurrency?: CurrencyCode;
  currentStep?: number;
  handleProceedToPayment?: () => void;
  isManualGateway?: boolean;
  isPending?: boolean;
  selectedGateway?: PaymentGateway | null;
  annualDiscount?: any;
}

function OrderSummary({
  selectedPlan,
  isAnnual,
  calculateTax: _calculateTax,
  calculateTotal: _calculateTotal,
  getDiscountedPrice,
  couponCode,
  couponApplied,
  couponDiscountAmount,
  couponCurrency,
}: OrderSummaryProps) {
  const { userCurrency, rates } = useAppContext();
  const convert = useCurrencyConverter();

  const interval = isAnnual ? "YEARLY" : "MONTHLY";
  const targetCurrency = userCurrency || "USD";
  const resolvedPrice = resolvePlanPrice(selectedPlan, interval, targetCurrency);
  const currencyCode = resolvedPrice.currency;
  const basePrice = resolvedPrice.amount;

  const payable = new Decimal(getDiscountedPrice());
  const convertAmount = (
    source: CurrencyCode,
    target: CurrencyCode,
    amount: string,
  ) => convertCurrency(source, target, amount, rates || {}).amount;

  const breakdown = computePricingBreakdown({
    subtotal: payable.toFixed(2),
    taxRate: resolvedPrice.taxRate,
    couponApplied,
    couponDiscountAmount,
    couponCurrency,
    subtotalCurrency: currencyCode,
    convertAmount,
  });

  const fmt = (amount: string, fromCurrency: CurrencyCode) =>
    convert(fromCurrency, userCurrency, amount, true, false).formatted;

  const displayBase = fmt(basePrice.toFixed(2), currencyCode);
  const derivedCurrency = currencyCode;

  const displayPayable = fmt(breakdown.subtotalAfterDiscount, derivedCurrency);
  const displayTax = fmt(breakdown.taxAmount, derivedCurrency);
  const displayTotal = fmt(breakdown.total, derivedCurrency);
  const displayCouponDiscount = new Decimal(breakdown.couponDiscount).gt(0)
    ? fmt(
        breakdown.couponDiscount,
        (couponCurrency || derivedCurrency) as CurrencyCode,
      )
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="lg:col-span-1"
    >
      <div className="bg-white rounded-[4px] border border-gray-200 p-6 sticky top-6">
        <h3 className="poppins text-lg font-bold text-gray-900 mb-6">
          Order Summary
        </h3>

        <div className="bg-primary/5 rounded-[4px] p-4 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">
                {isAnnual ? "Annual billing" : "Monthly billing"}
              </p>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {selectedPlan.name}
              </h3>
              <p className="text-xs uppercase text-gray-500 tracking-wide">
                {selectedPlan.description}
              </p>
            </div>

            <div className="text-right">
              <p className="poppins text-xl font-bold text-gray-900">
                {displayPayable}
              </p>
              <p className="text-xs text-gray-500 uppercase">
                {isAnnual ? "due today" : "due today"}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <span className="inter text-sm text-gray-600">Plan price</span>
            <span className="poppins font-semibold text-gray-900">
              {displayBase}
            </span>
          </div>

          {couponCode && couponApplied && (
            <div className="flex items-center justify-between">
              <span className="inter text-sm text-gray-600">Coupon ({couponCode})</span>
              <span className="poppins font-semibold text-emerald-700">
                {displayCouponDiscount ? `- ${displayCouponDiscount}` : "Applied"}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="inter text-sm text-gray-600">Subtotal</span>
            <span className="poppins font-semibold text-gray-900">
              {displayPayable}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="inter text-sm text-gray-600">Tax</span>
            <span className="poppins font-semibold text-gray-900">
              {displayTax}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <span className="poppins text-lg font-bold text-gray-900">Total</span>
          <span className="poppins text-2xl font-bold text-primary">
            {displayTotal}
          </span>
        </div>

        <div className="bg-gray-50 rounded-[4px] p-4">
          <p className="inter text-xs text-gray-600 leading-relaxed">
            By proceeding, you agree to our{" "}
            <Link
              to="/terms-of-service"
              className="text-primary hover:underline"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy-policy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
            . Your subscription will auto renew.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default OrderSummary;
