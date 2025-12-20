import type { SubscriptionPlan, Subscription } from "@/types";
import { motion } from "framer-motion";
import PricingFeatures from "./PricingFeatures";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/useAppContext";
import { useCurrencyConverter } from "@/lib/currencyConverter";

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

  const isSubscribed =
    !!currentSubscription &&
    currentSubscription.status === "ACTIVE" &&
    currentSubscription.plan.uid === plan.uid;

  const isUpgrade =
    !!currentSubscription &&
    currentSubscription.status === "ACTIVE" &&
    currentSubscription.plan.price < plan.price;

  const isDowngrade =
    !!currentSubscription &&
    currentSubscription.status === "ACTIVE" &&
    currentSubscription.plan.price > plan.price;

  const getPrice = (plan: SubscriptionPlan): string => {
    const base = Number(plan.price);

    if (isAnnual) {
      const yearly = base * 12;
      const discount = plan.discountForAnnually || 0;
      const discounted = yearly - yearly * (discount / 100);
      return discounted.toFixed(2);
    }

    return base.toFixed(2);
  };

  const hasAnnualDiscount = isAnnual && (plan.discountForAnnually ?? 0) > 0;

  // Determine button label
  let buttonLabel = "Start Now";
  if (isSubscribed) buttonLabel = "Your Current Plan";
  else if (isUpgrade) buttonLabel = "Upgrade Now";
  else if (isDowngrade) buttonLabel = "Downgrade Now";

  const isButtonDisabled = isSubscribed;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="relative w-full"
    >
      {/* Ribbon for Current Plan */}
      {isSubscribed && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="absolute -top-3 right-4 bg-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg z-20"
        >
          Current Plan
        </motion.div>
      )}

      <motion.div
        animate={
          isSubscribed
            ? { boxShadow: "0 0 22px rgba(125, 30, 254, 0.35)" }
            : { boxShadow: "0 0 6px rgba(0,0,0,0.08)" }
        }
        transition={{ duration: 0.4 }}
        className={`bg-white border border-gray-200 rounded-2xl hover:shadow-md transition-all duration-300 p-6 ${
          isSubscribed ? "border-purple-400" : ""
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Left Section */}
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {plan.name}
            </h3>
            <p className="text-xs uppercase text-gray-500 tracking-wide mb-6">
              {plan.description}
            </p>

            {hasAnnualDiscount && (
              <div className="mb-6 inline-block text-xs font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                Save {plan.discountForAnnually}% yearly
              </div>
            )}

            <PricingFeatures plan={plan} />
          </div>

          {/* Right Section */}
          <div className="flex flex-col items-center lg:items-end gap-4 lg:min-w-[200px]">
            <div className="text-center lg:text-right">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                Starting at
              </p>
              <div className="flex items-baseline justify-center lg:justify-end gap-1">
                <span className="text-4xl font-bold text-gray-900">
                  {
                    convert(
                      plan.currency,
                      userCurrency,
                      getPrice(plan),
                      true,
                      false
                    ).formatted
                  }
                </span>
                <span className="text-sm text-gray-500 font-medium">
                  {userCurrency}
                </span>
              </div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">
                {isAnnual ? "per year" : "per month"}
              </p>
            </div>

            <motion.button
              disabled={isButtonDisabled}
              whileHover={!isButtonDisabled ? { scale: 1.05 } : {}}
              whileTap={!isButtonDisabled ? { scale: 0.95 } : {}}
              onClick={() =>
                !isButtonDisabled &&
                navigate(`/subscription/upgrade-plan/${plan.id}`)
              }
              className={`w-full lg:w-auto px-8 poppins py-3 rounded-full font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg ${
                isButtonDisabled
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
              }`}
            >
              {buttonLabel}
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default PricingPlanCard;
