import Layout from "../components/Layout";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import type { PaymentGateway, SubscriptionPlan } from "@/types";
import { useGetUserSubscriptionPlans } from "@/hooks/use-subscription-plan";
import NotFound from "@/components/NotFound";
import Loader from "@/components/Loader";
import { useGetUserPaymentGateways } from "@/hooks/use-payment-gateway";
import { useAppContext } from "@/context/useAppContext";
import PlanSelectionStep from "../components/upgrade-plan/PlanSelectionStep";
import PaymentStep from "../components/upgrade-plan/PaymentStep";
import OrderSummary from "../components/upgrade-plan/OrderSummary";
import StepIndicator from "../components/upgrade-plan/StepIndicator";
import {
  useCreateSubscription,
  useDowngradeUserPlan,
  useGetUserActiveSubscription,
  useUpgradeUserPlan,
} from "@/hooks/use-subscription";
import { convertCurrency, type CurrencyCode } from "@/lib/currencyConverter";
import { useValidateCoupon } from "@/hooks/use-coupon";
import {
  computeCouponDiscountAmount,
  computePricingBreakdown,
  computeUpgradeDueToday,
  resolvePlanPrice,
} from "@/utils/subscription-pricing.utils";
import type { Coupon } from "@/types/models/coupon";
import CouponShowcase from "@/components/coupons/CouponShowcase";

function UpgradePlan() {
  const { id } = useParams();
  const planId = parseInt(id || "0");
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(
    null,
  );
  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway | null>(
    null,
  );
  const [isAnnual, setIsAnnual] = useState<boolean>(false);
  const [couponCode, setCouponCode] = useState("");
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [couponMessage, setCouponMessage] = useState("");
  const [couponDiscountAmount, setCouponDiscountAmount] = useState<string>();
  const [couponCurrency, setCouponCurrency] = useState<CurrencyCode>();
  const [validatedCoupon, setValidatedCoupon] = useState<Coupon | undefined>();
  const navigate = useNavigate();
  const { userCurrency, userInfo, rates } = useAppContext();
  // const convert = useCurrencyConverter();

  const { data: subscriptionPlans, isLoading } = useGetUserSubscriptionPlans();
  const { data: userSubscription, isLoading: isUserSubscriptionLoading } =
    useGetUserActiveSubscription();
  const { data: paymentGateways, isLoading: isGatewaysLoading } =
    useGetUserPaymentGateways();
  const { mutateAsync: upgradePlan, isPending } = useUpgradeUserPlan();
  const { mutateAsync: startSubscription, isPending: isStartPending } =
    useCreateSubscription();
  const { mutateAsync: validateCoupon, isPending: isCouponValidating } =
    useValidateCoupon();
  const { mutateAsync: downgradePlan, isPending: isDowngradePending } =
    useDowngradeUserPlan();

  useEffect(() => {
    if (subscriptionPlans) {
      const plan = subscriptionPlans.find((p) => p.id === planId);
      if (!plan) {
        navigate(-1);
        return;
      }
      setSelectedPlan(plan);
    }
  }, [planId, subscriptionPlans]);

  if (isLoading || isGatewaysLoading || isUserSubscriptionLoading) {
    return <Loader />;
  }

  if (!subscriptionPlans) {
    return <NotFound title="No subscription plan found" variant="page" />;
  }

  if (!paymentGateways) {
    return <NotFound title="No payment gateway found" variant="page" />;
  }

  if (!selectedPlan) return null;

  const interval = isAnnual ? "YEARLY" : "MONTHLY";
  const preferredCurrency = userCurrency || "USD";
  const resolvedSelectedPrice = resolvePlanPrice(
    selectedPlan,
    interval,
    preferredCurrency,
  );

  const getPrice = (plan: SubscriptionPlan) => {
    return resolvePlanPrice(plan, interval, preferredCurrency).amount;
  };

  // Returns amount due before tax for the selected plan/cycle, considering upgrades/downgrades
  const getDiscountedPrice = () => {
    const newPlanCost = resolvedSelectedPrice.amount;

    // No active subscription → pay full cost
    if (!userSubscription) {
      return newPlanCost.toFixed(2);
    }

    // Compare against current plan cost for the SAME INTERVAL type (usually)
    // Or compare against what user paid?
    // User subscription has `billingCycle`.
    // If user changes interval, usually new cycle starts.
    // If user keeps interval, diff applies.

    // Simplification: We only calculate delta if intervals match.
    // Ideally backend handles this.

    // let currentPlanCost = new Decimal(0);
    // Find price of current plan matching NEW interval choice? No, match OLD interval choice?
    // We match NEW interval choice for direct comparison.
    // Actually, if upgrading from Monthly to Annual, we pay Annual - (unused Monthly).
    // Frontend prediction is hard.

    // We will just return the New Plan Cost as the estimate "Due Today" unless standard upgrade.
    // Standard Upgrade = Same Interval.

    if (userSubscription.billingCycle === interval) {
      // Same interval upgrade
      return computeUpgradeDueToday(
        userSubscription.plan,
        selectedPlan,
        interval,
        preferredCurrency,
      );
    }

    // Different interval? usually full charge
    return newPlanCost.toFixed(2);
  };

  const dueTodayBeforeCoupon = getDiscountedPrice();

  const convertAmount = (
    source: CurrencyCode,
    target: CurrencyCode,
    amount: string,
  ) => {
    return convertCurrency(source, target, amount, rates || {}).amount;
  };

  const fallbackCouponDiscount = computeCouponDiscountAmount(
    dueTodayBeforeCoupon,
    resolvedSelectedPrice.currency,
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

  const effectiveCouponCurrency =
    couponCurrency || resolvedSelectedPrice.currency;

  const pricingBreakdown = computePricingBreakdown({
    subtotal: dueTodayBeforeCoupon,
    taxRate: resolvedSelectedPrice.taxRate,
    couponApplied: isCouponApplied,
    couponDiscountAmount: effectiveCouponDiscountAmount,
    couponCurrency: effectiveCouponCurrency,
    subtotalCurrency: resolvedSelectedPrice.currency,
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
      taxRate: resolvedSelectedPrice.taxRate,
      subtotalCurrency: resolvedSelectedPrice.currency,
    }).taxAmount;
  };

  const calculateTotal = () => {
    return pricingBreakdown.total;
  };

  const isManualGateway = selectedGateway?.platform === "MANUAL";
  const annualDiscount = false; // Deprecated field logic removed

  const newUrl = `${window.location.origin}/payment-status`;

  const handleProceedToPayment = async () => {
    if (!selectedGateway) return;

    // ... (This logic remains mostly same but uses getPrice instead of .price property)
    // Actually the logic uses backend endpoints which do the real calculation.
    try {
      const hasSubscription = !!userSubscription;

      // 1. No active subscription → START
      if (!hasSubscription) {
        const response = await startSubscription({
          planId: selectedPlan.id,
          billingCycle: isAnnual ? "YEARLY" : "MONTHLY",
          platform: selectedGateway.platform,
          redirectUrl: newUrl,
          currency: userCurrency,
          couponCode: isCouponApplied ? couponCode.trim() : undefined,
          amount: calculateTotal(),
          userId: userInfo?.id,
          appliesTo: "NEW",
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
        return;
      }

      const currentPrice = getPrice(userSubscription.plan!);
      const newPrice = getPrice(selectedPlan);

      // 2. Downgrade
      if (newPrice.lte(currentPrice)) {
        await downgradePlan({
          planId: selectedPlan.id,
        });

        navigate("/subscription?tab=plans");
        return;
      }

      // 3. Upgrade
      const response = await upgradePlan({
        planId: selectedPlan.id,
        billingCycle: isAnnual ? "YEARLY" : "MONTHLY",
        platform: selectedGateway.platform,
        redirectUrl: newUrl,
        currency: userCurrency,
        couponCode: isCouponApplied ? couponCode.trim() : undefined,
        amount: calculateTotal(),
        userId: userInfo?.id,
        appliesTo: "UPGRADE",
      });

      if (response.url) {
        window.location.href = response.url;
        return;
      }

      navigate("/payment-status?platform=manual");
    } catch (error) {
      console.error("Subscription action failed:", error);
    }
  };

  const applyCouponCode = async (code: string) => {
    if (!code.trim()) return;

    try {
      const validation = await validateCoupon({
        code: code.trim(),
        planId: selectedPlan.id,
        billingCycle: interval,
        currency: userCurrency,
        amount: calculateTotal(),
        appliesTo: userSubscription ? "UPGRADE" : "NEW",
        userId: userInfo?.id,
      });
      setValidatedCoupon(validation.coupon);
      const serverDiscount = validation.discountAmount;
      if (serverDiscount) {
        setCouponDiscountAmount(serverDiscount);
        setCouponCurrency(
          (validation.discountCurrency ||
            validation.coupon.currency ||
            resolvedSelectedPrice.currency) as CurrencyCode,
        );
      } else {
        setCouponDiscountAmount(undefined);
        setCouponCurrency(undefined);
      }
      setIsCouponApplied(true);
      setCouponMessage("Coupon validated and will be applied at checkout.");
    } catch (_error) {
      setIsCouponApplied(false);
      setCouponDiscountAmount(undefined);
      setCouponCurrency(undefined);
      setValidatedCoupon(undefined);
      setCouponMessage("Coupon could not be validated. Please check the code.");
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
      title={`Upgrade to ${selectedPlan.name}`}
      description="Complete your purchase in a few steps"
    >
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* MAIN CONTENT */}
          <div className="lg:col-span-2">
            {/* STEP INDICATOR */}
            <StepIndicator currentStep={currentStep} />
            <div className="mt-8">
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <PlanSelectionStep
                    key="step1"
                    selectedPlan={selectedPlan}
                    isAnnual={isAnnual}
                    setIsAnnual={setIsAnnual}
                    annualDiscount={annualDiscount}
                    userCurrency={userCurrency}
                    getDiscountedPrice={getDiscountedPrice}
                    setCurrentStep={setCurrentStep}
                  />
                )}

                {currentStep === 2 && (
                  <PaymentStep
                    key="step2"
                    paymentGateways={paymentGateways}
                    selectedGateway={selectedGateway}
                    setSelectedGateway={setSelectedGateway}
                    selectedPlan={selectedPlan}
                    canProceed={!!selectedGateway}
                    isProcessing={
                      isPending || isStartPending || isDowngradePending
                    }
                    isManualGateway={isManualGateway}
                    onBack={() => setCurrentStep(1)}
                    onProceed={handleProceedToPayment}
                    couponCode={couponCode}
                    couponAppliesTo={userSubscription ? "UPGRADE" : "NEW"}
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
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* SIDEBAR: Order Summary */}
          <div className="lg:col-span-1 space-y-4">
            <OrderSummary
              selectedPlan={selectedPlan}
              isAnnual={isAnnual}
              getDiscountedPrice={getDiscountedPrice}
              calculateTax={calculateTax}
              calculateTotal={calculateTotal}
              couponCode={couponCode}
              couponApplied={isCouponApplied}
              couponDiscountAmount={effectiveCouponDiscountAmount}
              couponCurrency={effectiveCouponCurrency}
              currentStep={currentStep}
              handleProceedToPayment={handleProceedToPayment}
              isManualGateway={isManualGateway}
              isPending={isPending || isStartPending || isDowngradePending}
              selectedGateway={selectedGateway}
              annualDiscount={annualDiscount}
            />

            <CouponShowcase
              context="SUBSCRIPTION_PAGE"
              appliesTo={userSubscription ? "UPGRADE" : "NEW"}
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
        </div>
      </div>
    </Layout>
  );
}

export default UpgradePlan;
