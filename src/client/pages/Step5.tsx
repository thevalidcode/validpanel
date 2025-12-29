import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  getOnboardingDraft,
  setOnboardingDraft,
} from "@/utils/onboarding.utils";
import OnboardingLayout from "../components/onboarding/OnboardingLayout";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useGetUserPaymentGateways } from "@/hooks/use-payment-gateway";
import NotFound from "@/components/NotFound";
import Loader from "@/components/Loader";
import { useGetUserSubscriptionPlanByUid } from "@/hooks/use-subscription-plan";
import { AlertTriangle } from "lucide-react";
import { useAppContext } from "@/context/useAppContext";
import type { PaymentMethod } from "@/types";
import { useCurrencyConverter } from "@/lib/currencyConverter";
import { useCreateSubscription } from "@/hooks/use-subscription";

const Step5: React.FC = () => {
  const navigate = useNavigate();
  const convert = useCurrencyConverter();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("MANUAL");
  const { userCurrency } = useAppContext();
  const { data: paymentOptions, isLoading } = useGetUserPaymentGateways();
  const { mutateAsync: initializePayment, isPending } = useCreateSubscription();
  const draft = getOnboardingDraft();

  const { data: subscriptionPlan, isLoading: isSubscriptionLoading } =
    useGetUserSubscriptionPlanByUid(draft?.planUid || "");

  const interval = draft?.subscriptionInterval ?? "MONTHLY";
  /**
   * PRICE CALCULATIONS
   */
  const { baseAmount, discountAmount, taxAmount, totalAmount } = useMemo(() => {
    if (!subscriptionPlan) {
      return {
        baseAmount: 0,
        discountAmount: 0,
        taxAmount: 0,
        totalAmount: 0,
      };
    }
    const monthlyPrice = Number(subscriptionPlan.price);

    const base = interval === "YEARLY" ? monthlyPrice * 12 : monthlyPrice;

    const discountPercent =
      interval === "YEARLY" ? subscriptionPlan.discountForAnnually ?? 0 : 0;

    const discount = (base * discountPercent) / 100;
    const afterDiscount = base - discount;

    const taxPercent = subscriptionPlan.tax ?? 0;
    const tax = (afterDiscount * taxPercent) / 100;

    return {
      baseAmount: base,
      discountAmount: discount,
      taxAmount: tax,
      totalAmount: afterDiscount + tax,
    };
  }, [subscriptionPlan, interval]);

  if (isLoading || isSubscriptionLoading) {
    return <Loader />;
  }

  if (!paymentOptions || !subscriptionPlan || !draft) {
    return <NotFound title="Payment information unavailable" variant="page" />;
  }

  const selectedPaymentOption = paymentOptions.find(
    (p) => p.platform === selectedMethod
  );

  const handlePayNow = async (): Promise<void> => {
    if (isPending) return;
    if (!selectedMethod) return;

    setOnboardingDraft((prev) => ({
      ...prev,
      selectedPayment: selectedMethod,
      completedSteps: [...new Set([...(prev.completedSteps ?? []), 5])],
    }));
    const response = await initializePayment({
      currency: userCurrency,
      platform: selectedMethod,
      planId: subscriptionPlan.id,
      redirectUrl: window.location.origin + window.location.pathname,
      billingCycle: draft.subscriptionInterval,
    });

    if (response.url) {
      navigate(response.url);
      return;
    }

    navigate("/onboarding/step6");
  };

  const handleBack = (): void => {
    navigate("/onboarding/step4");
  };

  return (
    <OnboardingLayout
      title="Payment Method"
      description="Select the payment method you’d like to use for this subscription."
      step={6}
      selected={!!selectedMethod && !isPending}
      onNext={handlePayNow}
      onBack={handleBack}
      nextButton={
        <>
          <span>{isPending ? "Redirecting..." : "Pay Now"}</span>
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
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl p-8 bg-white rounded-2xl shadow-lg mx-auto mt-6"
      >
        {/* Payment Options */}
        <div className="space-y-3">
          {paymentOptions.map(({ image, name, description, platform }) => {
            const isSelected = selectedMethod === platform;

            return (
              <label
                key={platform}
                className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition
                    ${
                      isSelected
                        ? "border-purple-600 shadow-md"
                        : "border-gray-200 hover:border-purple-300"
                    }`}
                onClick={() => setSelectedMethod(platform)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100">
                    <img src={image} alt={name} className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{name}</h4>
                    <p className="text-sm text-gray-500">{description}</p>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment"
                  className="accent-purple-600"
                  checked={isSelected}
                  readOnly
                />
              </label>
            );
          })}
        </div>

        {/* Payment Warning / Info */}
        {selectedPaymentOption?.content && (
          <div className="mt-5 flex gap-3 items-start rounded-xl border border-yellow-300 bg-yellow-50 p-4">
            <AlertTriangle className="text-yellow-600 mt-0.5" size={18} />
            <p className="text-sm text-yellow-800 leading-relaxed">
              {selectedPaymentOption?.content}
            </p>
          </div>
        )}

        {/* Order Summary */}
        <div className="mt-6 border-t border-gray-200 pt-4">
          <h3 className="font-semibold text-gray-800 mb-3">Order Summary</h3>

          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>
              {subscriptionPlan.name} ({interval})
            </span>
            <span>
              {
                convert(
                  subscriptionPlan.currency,
                  userCurrency,
                  baseAmount,
                  true,
                  false
                ).formatted
              }
            </span>
          </div>

          {discountAmount > 0 && (
            <div className="flex justify-between text-sm text-green-700 mb-1">
              <span>
                Annual Discount ({subscriptionPlan.discountForAnnually}%)
              </span>
              <span>
                -{" "}
                {
                  convert(
                    subscriptionPlan.currency,
                    userCurrency,
                    discountAmount,
                    true,
                    false
                  ).formatted
                }
              </span>
            </div>
          )}

          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>VAT ({subscriptionPlan.tax}%)</span>
            <span>
              -{" "}
              {
                convert(
                  subscriptionPlan.currency,
                  userCurrency,
                  taxAmount,
                  true,
                  false
                ).formatted
              }
            </span>
          </div>

          <div className="flex justify-between text-base font-semibold text-gray-900 mt-3">
            <span>Total</span>
            <span>
              {
                convert(
                  subscriptionPlan.currency,
                  userCurrency,
                  totalAmount,
                  true,
                  false
                ).formatted
              }
            </span>
          </div>
        </div>
      </motion.div>
    </OnboardingLayout>
  );
};

export default Step5;
