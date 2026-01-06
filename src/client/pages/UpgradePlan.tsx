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
import Decimal from "decimal.js";

function UpgradePlan() {
  const { id } = useParams();
  const planId = parseInt(id || "0");
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(
    null
  );
  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway | null>(
    null
  );
  const [isAnnual, setIsAnnual] = useState<boolean>(false);
  const navigate = useNavigate();
  const { userCurrency } = useAppContext();
  const { data: subscriptionPlans, isLoading } = useGetUserSubscriptionPlans();
  const { data: userSubscription, isLoading: isUserSubscriptionLoading } =
    useGetUserActiveSubscription();
  const { data: paymentGateways, isLoading: isGatewaysLoading } =
    useGetUserPaymentGateways();
  const { mutateAsync: upgradePlan, isPending } = useUpgradeUserPlan();
  const { mutateAsync: startSubscription, isPending: isStartPending } =
    useCreateSubscription();
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

  const getMonths = () => (isAnnual ? 12 : 1);

  const getBasePrice = () => new Decimal(selectedPlan.price).mul(getMonths());

  const getDiscountAmount = () => {
    const rate = isAnnual ? selectedPlan.discountForAnnually || 0 : 0;
    if (!rate) return "0.00";

    const base = getBasePrice();
    return base.mul(new Decimal(rate)).div(100).toFixed(2);
  };

  // Returns amount due before tax for the selected plan/cycle, considering upgrades/downgrades
  const getDiscountedPrice = () => {
    const base = getBasePrice();
    const discount = new Decimal(getDiscountAmount());
    let due = base.minus(discount);

    // No active subscription → pay full (after discount)
    if (!userSubscription) {
      return due.toFixed(2);
    }

    // Compare against current plan cost for the same cycle to decide upgrade/downgrade delta
    const currentBase = new Decimal(userSubscription.plan.price).mul(
      getMonths()
    );

    // Downgrade or equal → no payment required now
    if (due.lte(currentBase)) return "0.00";

    // Upgrade → pay the difference
    return due.minus(currentBase).toFixed(2);
  };

  const calculateTax = (amount: string) => {
    const value = new Decimal(amount);
    if (value.lte(0)) return "0.00";

    const taxRate = new Decimal(selectedPlan.tax || 0);
    return value.mul(taxRate.div(100)).toFixed(2);
  };

  const calculateTotal = () => {
    const subtotal = new Decimal(getDiscountedPrice());
    if (subtotal.lte(0)) return "0.00";

    const tax = new Decimal(calculateTax(subtotal.toString()));
    return subtotal.plus(tax).toFixed(2);
  };

  const isManualGateway = selectedGateway?.platform === "MANUAL";
  const annualDiscount = (selectedPlan.discountForAnnually || 0) > 0;

  const newUrl = `${window.location.origin}/subscription?tab=plans`;

  const handleProceedToPayment = async () => {
    if (!selectedGateway) return;

    try {
      const hasSubscription = !!userSubscription;

      // 1. No active subscription → START subscription (full payment)
      if (!hasSubscription) {
        const response = await startSubscription({
          planId: selectedPlan.id,
          billingCycle: isAnnual ? "YEARLY" : "MONTHLY",
          platform: selectedGateway.platform,
          redirectUrl: newUrl,
          currency: userCurrency,
        });

        if (selectedGateway.platform === "MANUAL") {
          navigate("/subscription");
          return;
        }

        if (response.url) {
          window.location.href = response.url;
          return;
        }

        navigate("/subscription?tab=plans");
        return;
      }

      const currentPrice = new Decimal(userSubscription.plan.price);
      const newPrice = new Decimal(selectedPlan.price);

      // 2. Downgrade → CALL backend downgrade logic (no payment)
      if (newPrice.lte(currentPrice)) {
        await downgradePlan({
          planId: selectedPlan.id,
        });

        navigate("/subscription?tab=plans");
        return;
      }

      // 3. Upgrade → payment flow
      const response = await upgradePlan({
        planId: selectedPlan.id,
        billingCycle: isAnnual ? "YEARLY" : "MONTHLY",
        platform: selectedGateway.platform,
        redirectUrl: newUrl,
        currency: userCurrency,
      });

      if (response.url) {
        window.location.href = response.url;
        return;
      }

      navigate("/subscription?tab=plans");
    } catch (error) {
      console.error("Subscription action failed:", error);
    }
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

            <AnimatePresence mode="wait">
              {currentStep === 1 ? (
                /* STEP 1: PLAN SELECTION */
                <PlanSelectionStep
                  selectedPlan={selectedPlan}
                  setCurrentStep={setCurrentStep}
                  getDiscountedPrice={getDiscountedPrice}
                  setIsAnnual={setIsAnnual}
                  annualDiscount={annualDiscount}
                  userCurrency={userCurrency}
                  isAnnual={isAnnual}
                />
              ) : (
                /* STEP 2: PAYMENT METHOD */
                <PaymentStep
                  paymentGateways={paymentGateways}
                  selectedGateway={selectedGateway}
                  setSelectedGateway={setSelectedGateway}
                  onBack={() => setCurrentStep(1)}
                  isProcessing={
                    isPending || isDowngradePending || isStartPending
                  }
                  isManualGateway={isManualGateway}
                  selectedPlan={selectedPlan}
                  canProceed={!!selectedGateway}
                  onProceed={handleProceedToPayment}
                />
              )}
            </AnimatePresence>
          </div>

          {/* ORDER SUMMARY */}
          <OrderSummary
            selectedPlan={selectedPlan}
            isAnnual={isAnnual}
            calculateTax={calculateTax}
            calculateTotal={calculateTotal}
            getDiscountedPrice={getDiscountedPrice}
          />
        </div>
      </div>
    </Layout>
  );
}

export default UpgradePlan;
