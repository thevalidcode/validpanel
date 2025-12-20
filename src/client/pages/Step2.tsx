import React, { useEffect, useState, type JSX } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { SubscriptionPlan } from "@/types";
import { formatPlanFeatures } from "@/utils/subscription-plan.utils";
import {
  getOnboardingDraft,
  setOnboardingDraft,
} from "@/utils/onboarding.utils";
import OnboardingLayout from "../components/onboarding/OnboardingLayout";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useGetUserSubscriptionPlans } from "@/hooks/use-subscription-plan";
import Loader from "@/components/Loader";
import NotFound from "@/components/NotFound";
import PricingToggle from "../components/pricing/PricingToggle";
import { useAppContext } from "@/context/useAppContext";
import { useCurrencyConverter } from "@/lib/currencyConverter";

const Step2: React.FC = () => {
  const navigate = useNavigate();

  const [selected, setSelected] = useState<string | null>(null);
  const [isAnnual, setIsAnnual] = useState<boolean>(false);
  const { userCurrency } = useAppContext();
  const convert = useCurrencyConverter();

  const { data: subscriptionPlans, isLoading } = useGetUserSubscriptionPlans();

  // Hydrate from draft
  useEffect(() => {
    const draft = getOnboardingDraft();
    if (draft?.planUid) setSelected(draft.planUid);
    if (draft?.subscriptionInterval) {
      setIsAnnual(draft.subscriptionInterval === "YEARLY");
    }
  }, []);

  if (isLoading) return <Loader />;

  if (!subscriptionPlans) {
    return <NotFound title="No subscription plan found" variant="page" />;
  }

  const handleContinue = (): void => {
    if (!selected) return;

    setOnboardingDraft((prev) => ({
      ...prev,
      planUid: selected,
      subscriptionInterval: isAnnual ? "YEARLY" : "MONTHLY",
      completedSteps: [...new Set([...(prev.completedSteps ?? []), 2])],
    }));

    navigate("/onboarding/step3");
  };

  const handleBack = (): void => {
    navigate("/onboarding/step1");
  };

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

  const renderPlanCard = (
    plan: SubscriptionPlan,
    index: number
  ): JSX.Element => {
    const isSelected = selected === plan.uid;
    const hasAnnualDiscount = isAnnual && (plan.discountForAnnually ?? 0) > 0;

    return (
      <motion.div
        key={plan.uid}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        onClick={() => setSelected(plan.uid)}
        className={`cursor-pointer bg-white rounded-2xl border-2 p-6 flex flex-col justify-between transition-all
          ${
            isSelected
              ? "border-purple-600 shadow-lg shadow-purple-200"
              : "border-gray-200 hover:border-purple-300"
          }`}
      >
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">
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
            <span className="text-sm text-gray-500 uppercase">
              {isAnnual ? "/year" : "/month"}
            </span>
          </div>

          {hasAnnualDiscount && (
            <div className="mt-2 inline-block text-xs font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">
              Save {plan.discountForAnnually}% yearly
            </div>
          )}

          <p className="text-gray-500 mt-3 text-xs uppercase tracking-wide">
            {plan.description}
          </p>

          <ul className="mt-5 space-y-2">
            {formatPlanFeatures(plan.features).map((f, idx) => (
              <li
                key={idx}
                className="text-sm text-gray-600 flex items-center gap-2"
              >
                <Check size={16} className="text-green-500" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    );
  };

  return (
    <OnboardingLayout
      title="Choose Your Plan"
      description="Pick a plan that aligns with your growth goals."
      step={2}
      selected={!!selected}
      onNext={handleContinue}
      onBack={handleBack}
      nextButton={
        <>
          <span>Continue</span>
          <FaArrowRight />
        </>
      }
      backButton={
        <>
          <FaArrowLeft />
          <span>Back</span>
        </>
      }
    >
      {/* Billing Toggle */}
      <div className="flex justify-center mb-10">
        <PricingToggle isAnnual={isAnnual} setIsAnnual={setIsAnnual} />
      </div>

      {/* Plans */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mx-auto mb-10"
      >
        {subscriptionPlans.map(renderPlanCard)}
      </motion.div>
    </OnboardingLayout>
  );
};

export default Step2;
