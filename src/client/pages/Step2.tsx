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
import CurrencySwitcher from "@/components/CurrencySwitcher";
import { useAppContext } from "@/context/useAppContext";
import {
  useCurrencyConverter,
  type CurrencyCode,
} from "@/lib/currencyConverter";
import { resolvePlanPrice } from "@/utils/subscription-pricing.utils";
import CouponShowcase from "@/components/coupons/CouponShowcase";
import type { Coupon } from "@/types/models/coupon";

const Step2: React.FC = () => {
  const navigate = useNavigate();

  const [selected, setSelected] = useState<string | null>(null);
  const [isAnnual, setIsAnnual] = useState<boolean>(false);
  const [selectedCouponCode, setSelectedCouponCode] = useState<string>("");
  const { userCurrency } = useAppContext();
  const convert = useCurrencyConverter();

  const { data: subscriptionPlans, isLoading } = useGetUserSubscriptionPlans();

  // Hydrate from draft
  useEffect(() => {
    const draft = getOnboardingDraft();
    if (draft?.planUid) setSelected(draft.planUid);
    if (draft?.couponCode) setSelectedCouponCode(draft.couponCode);
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
      couponCode: selectedCouponCode || prev.couponCode,
      subscriptionInterval: isAnnual ? "YEARLY" : "MONTHLY",
      completedSteps: [...new Set([...(prev.completedSteps ?? []), 2])],
    }));

    navigate("/onboarding/step3");
  };

  const handleBack = (): void => {
    navigate("/onboarding/step1");
  };

  const handleUseSuggestedCoupon = (coupon: Coupon): void => {
    setSelectedCouponCode(coupon.code);
    setOnboardingDraft((prev) => ({
      ...prev,
      couponCode: coupon.code,
    }));
  };

  const handleRemoveSuggestedCoupon = (): void => {
    setSelectedCouponCode("");
    setOnboardingDraft((prev) => ({
      ...prev,
      couponCode: "",
    }));
  };

  const getPrice = (plan: SubscriptionPlan): string => {
    const interval = isAnnual ? "YEARLY" : "MONTHLY";
    const resolved = resolvePlanPrice(plan, interval, userCurrency || "USD");
    return resolved.amount.toFixed(2);
  };

  const getCurrency = (plan: SubscriptionPlan): CurrencyCode => {
    const interval = isAnnual ? "YEARLY" : "MONTHLY";
    const resolved = resolvePlanPrice(plan, interval, userCurrency || "USD");
    return resolved.currency;
  };

  const renderPlanCard = (
    plan: SubscriptionPlan,
    index: number,
  ): JSX.Element => {
    const isSelected = selected === plan.uid;
    // Calculate potential savings (optional/advanced logic omitted for simplicity or can be re-added if data allows)
    const hasAnnualDiscount = false;

    return (
      <motion.div
        key={plan.uid}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        onClick={() => setSelected(plan.uid)}
        className={`cursor-pointer bg-white rounded-[4px] border-2 p-6 flex flex-col justify-between transition-all
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
                  getCurrency(plan),
                  userCurrency,
                  getPrice(plan),
                  true,
                  false,
                ).formatted
              }
            </span>
            <span className="text-sm text-gray-500 uppercase">
              {isAnnual ? "/year" : "/month"}
            </span>
          </div>

          {hasAnnualDiscount && (
            <div className="mt-2 inline-block text-xs font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">
              Save more with annual plan!
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
      {/* Billing Toggle and Currency Switcher */}
      <div className="flex flex-col items-center gap-6 mb-10">
        <PricingToggle isAnnual={isAnnual} setIsAnnual={setIsAnnual} />
        <CurrencySwitcher />
      </div>

      {/* Plans */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-10 mx-auto mb-10"
      >
        {subscriptionPlans.map(renderPlanCard)}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
        className="w-full max-w-3xl mx-auto"
      >
        <CouponShowcase
          context="SUBSCRIPTION_PAGE"
          appliesTo="NEW"
          variant="sidebar"
          title="Available Coupons"
          selectedCode={selectedCouponCode}
          onUseCoupon={handleUseSuggestedCoupon}
          onRemoveCoupon={handleRemoveSuggestedCoupon}
        />
      </motion.div>
    </OnboardingLayout>
  );
};

export default Step2;
