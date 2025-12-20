import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import type { SubscriptionPlan, SubscriptionPlanInterval } from "@/types";
import { useCurrencyConverter } from "@/lib/currencyConverter";
import { useAppContext } from "@/context/useAppContext";

interface OrderSummaryProps {
  selectedPlan: SubscriptionPlan;
  billingCycle: SubscriptionPlanInterval;
  calculateTax: (amount: string) => string;
  calculateTotal: () => string;
  getDiscountedPrice: () => string;
}

function OrderSummary({
  selectedPlan,
  billingCycle,
  calculateTax,
  calculateTotal,
  getDiscountedPrice,
}: OrderSummaryProps) {
  const { userCurrency } = useAppContext();
  const convert = useCurrencyConverter();

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
          <div className="flex items-center space-x-3 mb-3">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {selectedPlan.name}
              </h3>
              <p className="text-xs uppercase text-gray-500 tracking-wide mb-4">
                {selectedPlan.description}
              </p>
              <p className="inter text-xs text-gray-600 uppercase">
                {billingCycle === "YEARLY"
                  ? "Annual billing"
                  : "Monthly billing"}
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="poppins text-xl font-bold text-gray-900">
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
        </div>

        <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <span className="inter text-sm text-gray-600">Subtotal</span>
            <span className="poppins font-semibold text-gray-900">
              {
                convert(
                  selectedPlan.currency,
                  userCurrency,
                  getDiscountedPrice(),
                  true,
                  false
                ).formatted
              }
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="inter text-sm text-gray-600">Tax</span>
            <span className="poppins font-semibold text-gray-900">
              {
                convert(
                  selectedPlan.currency,
                  userCurrency,
                  calculateTax(getDiscountedPrice()),
                  true,
                  false
                ).formatted
              }
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <span className="poppins text-lg font-bold text-gray-900">Total</span>
          <span className="poppins text-2xl font-bold text-primary">
            {
              convert(
                selectedPlan.currency,
                userCurrency,
                calculateTotal(),
                true,
                false
              ).formatted
            }
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
