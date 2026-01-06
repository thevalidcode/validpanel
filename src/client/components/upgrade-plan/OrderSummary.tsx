import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import type { SubscriptionPlan } from "@/types";
import { useCurrencyConverter } from "@/lib/currencyConverter";
import { useAppContext } from "@/context/useAppContext";
import Decimal from "decimal.js";

interface OrderSummaryProps {
  selectedPlan: SubscriptionPlan;
  isAnnual: boolean;
  calculateTax: (amount: string) => string;
  calculateTotal: () => string;
  getDiscountedPrice: () => string;
}

function OrderSummary({
  selectedPlan,
  isAnnual,
  calculateTax,
  calculateTotal,
  getDiscountedPrice,
}: OrderSummaryProps) {
  const { userCurrency } = useAppContext();
  const convert = useCurrencyConverter();
  const basePrice = isAnnual
    ? new Decimal(selectedPlan.price).mul(12)
    : new Decimal(selectedPlan.price);

  const discount =
    isAnnual && selectedPlan.discountForAnnually
      ? basePrice
          .mul(new Decimal(selectedPlan.discountForAnnually))
          .div(100)
          .toFixed(2)
      : "0.00";

  const payable = new Decimal(getDiscountedPrice());
  const taxAmount = new Decimal(calculateTax(payable.toFixed(2)));
  const total = new Decimal(calculateTotal());

  const subtotalAfterDiscount = basePrice.minus(new Decimal(discount));
  const credit = subtotalAfterDiscount.minus(payable);

  const displayBase = convert(
    selectedPlan.currency,
    userCurrency,
    basePrice.toFixed(2),
    true,
    false
  ).formatted;

  const displayDiscount = convert(
    selectedPlan.currency,
    userCurrency,
    discount,
    true,
    false
  ).formatted;

  const displayPayable = convert(
    selectedPlan.currency,
    userCurrency,
    payable.toFixed(2),
    true,
    false
  ).formatted;

  const displayTax = convert(
    selectedPlan.currency,
    userCurrency,
    taxAmount.toFixed(2),
    true,
    false
  ).formatted;

  const displayTotal = convert(
    selectedPlan.currency,
    userCurrency,
    total.toFixed(2),
    true,
    false
  ).formatted;

  const displayCredit = convert(
    selectedPlan.currency,
    userCurrency,
    credit.toFixed(2),
    true,
    false
  ).formatted;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="lg:col-span-1"
    >
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-6">
        <h3 className="poppins text-lg font-bold text-gray-900 mb-6">
          Order Summary
        </h3>

        <div className="bg-primary/5 rounded-xl p-4 mb-6">
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
                {isAnnual ? "due today (yearly)" : "due today (monthly)"}
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

          {discount !== "0.00" && (
            <div className="flex items-center justify-between">
              <span className="inter text-sm text-gray-600">
                Annual discount
              </span>
              <span className="poppins font-semibold text-green-700">
                - {displayDiscount}
              </span>
            </div>
          )}

          {credit.gt(0) && (
            <div className="flex items-center justify-between">
              <span className="inter text-sm text-gray-600">
                Current plan credit
              </span>
              <span className="poppins font-semibold text-green-700">
                - {displayCredit}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="inter text-sm text-gray-600">
              Subtotal after credits
            </span>
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

        <div className="bg-gray-50 rounded-lg p-4">
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
