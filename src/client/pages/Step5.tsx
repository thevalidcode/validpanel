import React, { useEffect, useMemo, useState } from "react";
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
import {
  convertCurrency,
  useCurrencyConverter,
  type CurrencyCode,
} from "@/lib/currencyConverter";
import { useCreateSubscription } from "@/hooks/use-subscription";
import { useValidateCoupon } from "@/hooks/use-coupon";
import CouponCodeField from "@/components/coupons/CouponCodeField";
import CouponShowcase from "@/components/coupons/CouponShowcase";
import {
  computeCouponDiscountAmount,
  computePricingBreakdown,
  resolvePlanPrice,
} from "@/utils/subscription-pricing.utils";
import type { Coupon } from "@/types/models/coupon";

const Step5: React.FC = () => {
  const navigate = useNavigate();
  const convert = useCurrencyConverter();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("MANUAL");
  const { userCurrency, userInfo, rates } = useAppContext();
  const [couponCode, setCouponCode] = useState("");
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [couponMessage, setCouponMessage] = useState("");
  const [couponDiscountAmount, setCouponDiscountAmount] = useState<string>();
  const [couponCurrency, setCouponCurrency] = useState<CurrencyCode>();
  const [validatedCoupon, setValidatedCoupon] = useState<Coupon | undefined>();
  const { data: paymentOptions, isLoading } = useGetUserPaymentGateways();
  const { mutateAsync: initializePayment, isPending } = useCreateSubscription();
  const { mutateAsync: validateCoupon, isPending: isCouponValidating } =
    useValidateCoupon();
  const draft = getOnboardingDraft();

  useEffect(() => {
    if (draft?.couponCode) {
      setCouponCode(draft.couponCode);
    }
  }, [draft?.couponCode]);

  const { data: subscriptionPlan, isLoading: isSubscriptionLoading } =
    useGetUserSubscriptionPlanByUid(draft?.planUid || "");

  const interval = draft?.subscriptionInterval ?? "MONTHLY";
  const {
    baseAmount,
    discountAmount,
    taxAmount,
    totalAmount,
    currency,
    taxPercent,
    discountPercent,
  } = useMemo(() => {
    if (!subscriptionPlan) {
      return {
        baseAmount: "0.00",
        discountAmount: "0.00",
        taxAmount: "0.00",
        totalAmount: "0.00",
        currency: "USD" as CurrencyCode,
        taxPercent: 0,
        discountPercent: 0,
      };
    }
    const resolvedPrice = resolvePlanPrice(
      subscriptionPlan,
      interval,
      userCurrency || "USD",
    );

    const convertAmount = (
      source: CurrencyCode,
      target: CurrencyCode,
      amount: string,
    ) => {
      return convertCurrency(source, target, amount, rates || {}).amount;
    };

    const fallbackCouponDiscount = computeCouponDiscountAmount(
      resolvedPrice.amount.toFixed(2),
      resolvedPrice.currency,
      validatedCoupon
        ? {
            type: validatedCoupon.type,
            value: validatedCoupon.value,
            currency: validatedCoupon.currency,
          }
        : undefined,
      isCouponApplied,
      undefined,
      undefined,
      convertAmount,
    );

    const effectiveCouponDiscountAmount =
      couponDiscountAmount ||
      (isCouponApplied ? fallbackCouponDiscount.toFixed(2) : undefined);

    const breakdown = computePricingBreakdown({
      subtotal: resolvedPrice.amount.toFixed(2),
      taxRate: resolvedPrice.taxRate,
      couponApplied: isCouponApplied,
      couponDiscountAmount: effectiveCouponDiscountAmount,
      couponCurrency: couponCurrency || resolvedPrice.currency,
      subtotalCurrency: resolvedPrice.currency,
      coupon: validatedCoupon
        ? {
            type: validatedCoupon.type,
            value: validatedCoupon.value,
            currency: validatedCoupon.currency,
          }
        : undefined,
      convertAmount,
    });

    const base = resolvedPrice.amount.toFixed(2);
    const taxPercent = Number(resolvedPrice.taxRate.toString() || 0);
    const computedCouponDiscount = breakdown.couponDiscount;

    const discountPercent = resolvedPrice.amount.gt(0)
      ? Number(
          new Intl.NumberFormat("en-US", {
            maximumFractionDigits: 2,
          }).format(
            (Number(computedCouponDiscount) / Number(base || "1")) * 100,
          ),
        )
      : 0;

    return {
      baseAmount: base,
      discountAmount: computedCouponDiscount,
      taxAmount: breakdown.taxAmount,
      totalAmount: breakdown.total,
      currency: resolvedPrice.currency,
      taxPercent,
      discountPercent,
    };
  }, [
    subscriptionPlan,
    interval,
    userCurrency,
    rates,
    couponDiscountAmount,
    couponCurrency,
    isCouponApplied,
    validatedCoupon,
  ]);

  if (isLoading || isSubscriptionLoading) {
    return <Loader />;
  }

  if (!paymentOptions || !subscriptionPlan || !draft) {
    return <NotFound title="Payment information unavailable" variant="page" />;
  }

  const baseUrl = window.location.origin + window.location.pathname;

  // Extract the step number
  const stepMatch = baseUrl.match(/step(\d+)/);

  let newUrl = baseUrl;

  if (stepMatch) {
    const currentStep = parseInt(stepMatch[1], 10); // get number after "step"
    const nextStep = currentStep + 1;
    // Replace the old step number with the incremented one
    newUrl = baseUrl.replace(/step\d+/, `step${nextStep}`);
  }

  const selectedPaymentOption = paymentOptions.find(
    (p) => p.platform === selectedMethod,
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
      redirectUrl: newUrl,
      billingCycle: draft.subscriptionInterval,
      couponCode: isCouponApplied ? couponCode.trim() : undefined,
      amount: totalAmount,
      userId: userInfo?.id,
      appliesTo: "NEW",
    });

    if (response.url) {
      window.location.href = response.url;
      return;
    }

    navigate("/onboarding/step6");
  };

  const handleBack = (): void => {
    navigate("/onboarding/step4");
  };

  const handleApplyCoupon = async (): Promise<void> => {
    if (!couponCode.trim()) return;

    try {
      const validation = await validateCoupon({
        code: couponCode.trim(),
        planId: subscriptionPlan.id,
        billingCycle: interval,
        currency,
        amount: totalAmount,
        appliesTo: "NEW",
        userId: userInfo?.id,
      });
      setValidatedCoupon(validation.coupon);
      const serverDiscount = validation.discountAmount;
      if (serverDiscount) {
        setCouponDiscountAmount(serverDiscount);
        setCouponCurrency(
          (validation.discountCurrency ||
            validation.coupon.currency ||
            currency) as CurrencyCode,
        );
      } else {
        setCouponDiscountAmount(undefined);
        setCouponCurrency(undefined);
      }
      setIsCouponApplied(true);
      setCouponMessage("Coupon validated and will be applied at checkout.");
      setOnboardingDraft((prev) => ({
        ...prev,
        couponCode: couponCode.trim(),
      }));
    } catch (_error) {
      setIsCouponApplied(false);
      setCouponDiscountAmount(undefined);
      setCouponCurrency(undefined);
      setValidatedCoupon(undefined);
      setCouponMessage(
        "Coupon could not be validated. Please try another code.",
      );
    }
  };

  const handleUseSuggestedCoupon = async (code: string): Promise<void> => {
    setCouponCode(code);
    setIsCouponApplied(false);
    setCouponDiscountAmount(undefined);
    setCouponCurrency(undefined);
    setValidatedCoupon(undefined);

    try {
      const validation = await validateCoupon({
        code,
        planId: subscriptionPlan.id,
        billingCycle: interval,
        currency,
        amount: totalAmount,
        appliesTo: "NEW",
        userId: userInfo?.id,
      });
      setValidatedCoupon(validation.coupon);
      const serverDiscount = validation.discountAmount;
      if (serverDiscount) {
        setCouponDiscountAmount(serverDiscount);
        setCouponCurrency(
          (validation.discountCurrency ||
            validation.coupon.currency ||
            currency) as CurrencyCode,
        );
      }
      setIsCouponApplied(true);
      setCouponMessage("Coupon validated and will be applied at checkout.");
      setOnboardingDraft((prev) => ({
        ...prev,
        couponCode: code,
      }));
    } catch (_error) {
      setCouponMessage(
        "Coupon could not be validated. Please try another code.",
      );
    }
  };

  const handleRemoveSuggestedCoupon = (): void => {
    setCouponCode("");
    setIsCouponApplied(false);
    setCouponDiscountAmount(undefined);
    setCouponCurrency(undefined);
    setValidatedCoupon(undefined);
    setCouponMessage("");
    setOnboardingDraft((prev) => ({
      ...prev,
      couponCode: "",
    }));
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
        className="w-full max-w-2xl mx-auto"
      >
        {/* Payment Options */}
        <div className="space-y-3">
          {paymentOptions.map(({ image, name, description, platform }) => {
            const isSelected = selectedMethod === platform;

            return (
              <label
                key={platform}
                className={`flex items-center justify-between p-4 border rounded-[4px] cursor-pointer transition
                    ${
                      isSelected
                        ? "border-purple-600 shadow-md"
                        : "border-gray-200 hover:border-purple-300"
                    }`}
                onClick={() => setSelectedMethod(platform)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center rounded-[4px] bg-gray-100">
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
          <div className="mt-5 flex gap-3 items-start rounded-[4px] border border-yellow-300 bg-yellow-50 p-4">
            <AlertTriangle className="text-yellow-600 mt-0.5" size={18} />
            <p className="text-sm text-yellow-800 leading-relaxed">
              {selectedPaymentOption?.content}
            </p>
          </div>
        )}

        <div className="mt-5">
          <CouponCodeField
            value={couponCode}
            onChange={(value) => {
              setCouponCode(value);
              if (isCouponApplied) {
                setIsCouponApplied(false);
                setCouponDiscountAmount(undefined);
                setCouponCurrency(undefined);
                setValidatedCoupon(undefined);
              }
            }}
            onApply={handleApplyCoupon}
            isApplying={isCouponValidating}
            applied={isCouponApplied}
            message={couponMessage}
            disabled={isPending}
          />
        </div>

        <div className="mt-4">
          <CouponShowcase
            context="SUBSCRIPTION_PAGE"
            appliesTo="NEW"
            variant="sidebar"
            title="Available Coupons"
            selectedCode={couponCode}
            isApplying={isCouponValidating}
            onUseCoupon={(coupon) => {
              handleUseSuggestedCoupon(coupon.code);
            }}
            onRemoveCoupon={handleRemoveSuggestedCoupon}
          />
        </div>

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
                  currency,
                  userCurrency,
                  baseAmount.toString(),
                  true,
                  false,
                ).formatted
              }
            </span>
          </div>

          {Number(discountAmount) > 0 && (
            <div className="flex justify-between text-sm text-green-700 mb-1">
              <span>Coupon Discount ({discountPercent}%)</span>
              <span>
                -{" "}
                {
                  convert(currency, userCurrency, discountAmount, true, false)
                    .formatted
                }
              </span>
            </div>
          )}

          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>VAT ({taxPercent}%)</span>
            <span>
              -{" "}
              {
                convert(currency, userCurrency, taxAmount, true, false)
                  .formatted
              }
            </span>
          </div>

          <div className="flex justify-between text-base font-semibold text-gray-900 mt-3">
            <span>Total</span>
            <span>
              {
                convert(currency, userCurrency, totalAmount, true, false)
                  .formatted
              }
            </span>
          </div>
        </div>
      </motion.div>
    </OnboardingLayout>
  );
};

export default Step5;
