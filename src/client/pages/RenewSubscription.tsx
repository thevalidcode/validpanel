import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import type { PaymentGateway, SubscriptionPlan } from "@/types";
import { useGetUserPaymentGateways } from "@/hooks/use-payment-gateway";
import { useAppContext } from "@/context/useAppContext";
import PaymentStep from "../components/upgrade-plan/PaymentStep";
import OrderSummary from "../components/upgrade-plan/OrderSummary";
import StepIndicator from "../components/upgrade-plan/StepIndicator";
import {
  useGetUserCurrentSubscription,
  useRenewSubscription,
} from "@/hooks/use-subscription";
import Loader from "@/components/Loader";
import NotFound from "@/components/NotFound";
import AnimatedSection from "@/components/AnimatedSection";
import { useValidateCoupon } from "@/hooks/use-coupon";
import { convertCurrency, type CurrencyCode } from "@/lib/currencyConverter";
import {
  computeCouponDiscountAmount,
  computePricingBreakdown,
  resolvePlanPrice,
} from "@/utils/subscription-pricing.utils";
import type { Coupon } from "@/types/models/coupon";
import CouponShowcase from "@/components/coupons/CouponShowcase";

function RenewSubscription() {
  const navigate = useNavigate();
  const { userCurrency, isAuthLoading, rates } = useAppContext();

  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway | null>(
    null,
  );
  const [couponCode, setCouponCode] = useState("");
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [couponMessage, setCouponMessage] = useState("");
  const [couponDiscountAmount, setCouponDiscountAmount] = useState<string>();
  const [couponCurrency, setCouponCurrency] = useState<CurrencyCode>();
  const [validatedCoupon, setValidatedCoupon] = useState<Coupon | undefined>();

  const { data: userSubscription, isLoading: isSubscriptionLoading } =
    useGetUserCurrentSubscription();
  const [isAnnual, _] = useState<boolean>(
    userSubscription?.billingCycle === "YEARLY",
  );

  const { data: paymentGateways, isLoading: isGatewaysLoading } =
    useGetUserPaymentGateways();

  const { mutateAsync: renewSubscription, isPending } = useRenewSubscription();
  const { mutateAsync: validateCoupon, isPending: isCouponValidating } =
    useValidateCoupon();

  useEffect(() => {
    if (!isSubscriptionLoading && !isAuthLoading) {
      if (!userSubscription) {
        navigate("/subscription");
      }
    }
  }, [isSubscriptionLoading, userSubscription, isAuthLoading]);

  if (isSubscriptionLoading || isGatewaysLoading || isAuthLoading) {
    return <Loader />;
  }

  if (!userSubscription) {
    return <NotFound title="No active subscription found" variant="page" />;
  }

  if (!paymentGateways) {
    return <NotFound title="No payment gateways available" variant="page" />;
  }

  const plan: SubscriptionPlan = userSubscription.plan!;
  const billingCycle = userSubscription.billingCycle;
  const resolvedPlanPrice = resolvePlanPrice(
    plan,
    billingCycle,
    userCurrency || "USD",
  );

  const getBasePrice = () => resolvedPlanPrice.amount.toFixed(2);

  const convertAmount = (
    source: CurrencyCode,
    target: CurrencyCode,
    amount: string,
  ) => {
    return convertCurrency(source, target, amount, rates || {}).amount;
  };

  const fallbackCouponDiscount = computeCouponDiscountAmount(
    getBasePrice(),
    resolvedPlanPrice.currency,
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
  const effectiveCouponCurrency = couponCurrency || resolvedPlanPrice.currency;

  const pricingBreakdown = computePricingBreakdown({
    subtotal: getBasePrice(),
    taxRate: resolvedPlanPrice.taxRate,
    couponApplied: isCouponApplied,
    couponDiscountAmount: effectiveCouponDiscountAmount,
    couponCurrency: effectiveCouponCurrency,
    subtotalCurrency: resolvedPlanPrice.currency,
    coupon: validatedCoupon
      ? {
          type: validatedCoupon.type,
          value: validatedCoupon.value,
          currency: validatedCoupon.currency,
        }
      : undefined,
    convertAmount,
  });

  const calculateTax = (amount: string) => {
    return computePricingBreakdown({
      subtotal: amount,
      taxRate: resolvedPlanPrice.taxRate,
      subtotalCurrency: resolvedPlanPrice.currency,
    }).taxAmount;
  };

  const calculateTotal = () => {
    return pricingBreakdown.total;
  };

  const handleProceedToPayment = async () => {
    if (!selectedGateway) return;

    try {
      const response = await renewSubscription({
        platform: selectedGateway.platform,
        currency: userCurrency,
        billingCycle: billingCycle,
        planId: plan.id,
        redirectUrl: `${window.location.origin}/payment-status`,
        couponCode: isCouponApplied ? couponCode.trim() : undefined,
        amount: calculateTotal(),
        userId: userSubscription.userId,
        appliesTo: "RENEWAL",
      });

      if (selectedGateway.platform === "MANUAL") {
        navigate("/payment-status?platform=manual");
        return;
      }

      if (response.url) {
        window.location.href = response.url;
        return;
      }

      navigate("/payment-status?platform=manual");
    } catch (error) {
      console.error("Renewal failed:", error);
    }
  };

  const applyCouponCode = async (code: string) => {
    if (!code.trim()) return;

    try {
      const validation = await validateCoupon({
        code: code.trim(),
        planId: plan.id,
        billingCycle,
        currency: userCurrency,
        amount: calculateTotal(),
        appliesTo: "RENEWAL",
        userId: userSubscription.userId,
      });
      setValidatedCoupon(validation.coupon);
      const serverDiscount = validation.discountAmount;
      if (serverDiscount) {
        setCouponDiscountAmount(serverDiscount);
        setCouponCurrency(
          (validation.discountCurrency ||
            validation.coupon.currency ||
            resolvedPlanPrice.currency) as CurrencyCode,
        );
      } else {
        setCouponDiscountAmount(undefined);
        setCouponCurrency(undefined);
      }
      setIsCouponApplied(true);
      setCouponMessage("Coupon validated and will be applied to this renewal.");
    } catch (_error) {
      setIsCouponApplied(false);
      setCouponDiscountAmount(undefined);
      setCouponCurrency(undefined);
      setValidatedCoupon(undefined);
      setCouponMessage("Coupon could not be validated for renewal.");
    }
  };

  const handleApplyCoupon = async () => {
    await applyCouponCode(couponCode);
  };

  const handleUseSuggestedCoupon = async (code: string) => {
    setCouponCode(code);
    setIsCouponApplied(false);
    setCouponDiscountAmount(undefined);
    setCouponCurrency(undefined);
    setValidatedCoupon(undefined);
    await applyCouponCode(code);
  };

  const handleRemoveSuggestedCoupon = () => {
    setCouponCode("");
    setIsCouponApplied(false);
    setCouponDiscountAmount(undefined);
    setCouponCurrency(undefined);
    setValidatedCoupon(undefined);
    setCouponMessage("");
  };

  return (
    <Layout
      title={`Renew ${plan.name}`}
      description="Secure checkout to continue your subscription."
    >
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <AnimatedSection>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* MAIN */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-[4px] border border-gray-200 shadow-sm p-6">
                <StepIndicator currentStep={2} />
                <div className="mt-8">
                  <AnimatePresence mode="wait">
                    <PaymentStep
                      paymentGateways={paymentGateways}
                      selectedGateway={selectedGateway}
                      setSelectedGateway={setSelectedGateway}
                      onBack={() => navigate("/subscription")}
                      isProcessing={isPending}
                      isManualGateway={selectedGateway?.platform === "MANUAL"}
                      selectedPlan={plan}
                      canProceed={!!selectedGateway}
                      onProceed={handleProceedToPayment}
                      couponCode={couponCode}
                      couponAppliesTo="RENEWAL"
                      onUseSuggestedCoupon={handleUseSuggestedCoupon}
                      onRemoveSuggestedCoupon={handleRemoveSuggestedCoupon}
                      onCouponCodeChange={(code) => {
                        setCouponCode(code);
                        if (isCouponApplied) {
                          setIsCouponApplied(false);
                          setCouponDiscountAmount(undefined);
                          setCouponCurrency(undefined);
                          setValidatedCoupon(undefined);
                        }
                      }}
                      onApplyCoupon={handleApplyCoupon}
                      isCouponApplying={isCouponValidating}
                      couponApplied={isCouponApplied}
                      couponMessage={couponMessage}
                    />
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* SUMMARY */}
            <div className="space-y-4">
              <OrderSummary
                selectedPlan={plan}
                isAnnual={isAnnual}
                calculateTax={calculateTax}
                calculateTotal={calculateTotal}
                getDiscountedPrice={getBasePrice}
                couponCode={couponCode}
                couponApplied={isCouponApplied}
                couponDiscountAmount={effectiveCouponDiscountAmount}
                couponCurrency={effectiveCouponCurrency}
              />

              <CouponShowcase
                context="SUBSCRIPTION_PAGE"
                appliesTo="RENEWAL"
                variant="sidebar"
                title="Available Renewal Coupons"
                selectedCode={couponCode}
                isApplying={isCouponValidating}
                onUseCoupon={(coupon) => {
                  handleUseSuggestedCoupon(coupon.code);
                }}
                onRemoveCoupon={handleRemoveSuggestedCoupon}
              />
            </div>
          </div>
        </AnimatedSection>
      </div>
    </Layout>
  );
}

export default RenewSubscription;
