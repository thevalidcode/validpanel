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
  useGetUserActiveSubscription,
  useRenewSubscription,
} from "@/hooks/use-subscription";
import Loader from "@/components/Loader";
import NotFound from "@/components/NotFound";
import Decimal from "decimal.js";

function RenewSubscription() {
  const navigate = useNavigate();
  const { userCurrency } = useAppContext();

  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway | null>(
    null
  );

  const { data: userSubscription, isLoading: isSubscriptionLoading } =
    useGetUserActiveSubscription();

  const { data: paymentGateways, isLoading: isGatewaysLoading } =
    useGetUserPaymentGateways();

  const { mutateAsync: renewSubscription, isPending } = useRenewSubscription();

  useEffect(() => {
    if (!isSubscriptionLoading && !userSubscription) {
      navigate("/subscription");
    }
  }, [userSubscription, isSubscriptionLoading]);

  if (isSubscriptionLoading || isGatewaysLoading) {
    return <Loader />;
  }

  if (!userSubscription) {
    return <NotFound title="No active subscription found" variant="page" />;
  }

  if (!paymentGateways) {
    return <NotFound title="No payment gateways available" variant="page" />;
  }

  const plan: SubscriptionPlan = userSubscription.plan;
  const billingCycle = userSubscription.billingCycle;

  const getBasePrice = () => {
    const price = new Decimal(plan.price);

    if (billingCycle === "YEARLY") {
      const annualBase = price.mul(12);
      const discount = new Decimal(plan.discountForAnnually || 0);
      return annualBase.minus(annualBase.mul(discount.div(100))).toFixed(2);
    }

    return price.toFixed(2);
  };

  const calculateTax = (amount: string) => {
    const value = new Decimal(amount);
    if (value.lte(0)) return "0.00";

    const taxRate = new Decimal(plan.tax || 0);
    return value.mul(taxRate.div(100)).toFixed(2);
  };

  const calculateTotal = () => {
    const subtotal = new Decimal(getBasePrice());
    const tax = new Decimal(calculateTax(subtotal.toString()));
    return subtotal.plus(tax).toFixed(2);
  };

  const handleProceedToPayment = async () => {
    if (!selectedGateway) return;

    try {
      const response = await renewSubscription({
        platform: selectedGateway.platform,
        currency: userCurrency,
        planId: plan.id,
        redirectUrl: window.location.origin + window.location.pathname,
      });

      if (selectedGateway.platform === "MANUAL") {
        navigate("/subscription");
        return;
      }

      navigate(response.url || "/subscription");
    } catch (error) {
      console.error("Renewal failed:", error);
    }
  };

  return (
    <Layout
      title={`Renew ${plan.name}`}
      description="Renew your subscription to continue uninterrupted access"
    >
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* MAIN */}
          <div className="lg:col-span-2">
            <StepIndicator currentStep={2} />
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
              />
            </AnimatePresence>
          </div>

          {/* SUMMARY */}
          <OrderSummary
            selectedPlan={plan}
            billingCycle={billingCycle}
            calculateTax={calculateTax}
            calculateTotal={calculateTotal}
            getDiscountedPrice={getBasePrice}
          />
        </div>
      </div>
    </Layout>
  );
}

export default RenewSubscription;
