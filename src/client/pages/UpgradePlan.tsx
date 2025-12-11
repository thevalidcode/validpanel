import Layout from "../components/Layout";
import { Link, useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Lock,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { mockPaymentGateways, mockPlans } from "@/_docs/doc";
import type { PaymentGateway, SubscriptionPlan } from "@/types";
import PricingFeatures from "../components/pricing/PricingFeatures";

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
  const [billingCycle, setBillingCycle] = useState<"MONTHLY" | "ANNUAL">(
    "MONTHLY"
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const plan = mockPlans.find((p) => p.id === planId);
    if (!plan) {
      navigate(-1);
      return;
    }
    setSelectedPlan(plan);
  }, [planId]);

  if (!selectedPlan) return null;

  const getDiscountedPrice = () => {
    const basePrice = parseFloat(selectedPlan.price);

    if (billingCycle === "ANNUAL") {
      const annualBase = basePrice * 12;
      const discount = selectedPlan.discountForAnnually || 0;
      return (annualBase - annualBase * (discount / 100)).toFixed(2);
    }

    return selectedPlan.price;
  };

  const calculateTax = (amount: string) => {
    return (parseFloat(amount) * (selectedPlan.tax / 100)).toFixed(2);
  };

  const calculateTotal = () => {
    const subtotal = parseFloat(getDiscountedPrice());
    const tax = parseFloat(calculateTax(getDiscountedPrice()));
    return (subtotal + tax).toFixed(2);
  };

  const handleProceedToPayment = async () => {
    if (!selectedGateway) return;

    if (selectedGateway.platform === "MANUAL") {
      alert("Manual payment instructions will be provided.");
      return;
    }

    setIsProcessing(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const mockPaymentUrl = `https://payment.gateway.com/checkout/${selectedGateway.uid}/${selectedPlan.uid}?cycle=${billingCycle}`;
      window.location.href = mockPaymentUrl;
    } catch (error) {
      console.error("Payment error:", error);
      setIsProcessing(false);
    }
  };

  const isManualGateway = selectedGateway?.platform === "MANUAL";
  const canProceed = selectedGateway && !isManualGateway;

  const annualDiscount = selectedPlan.discountForAnnually > 0;

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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-8"
            >
              <div className="flex items-center justify-center space-x-4">
                {[
                  { num: 1, label: "Plan Selection" },
                  { num: 2, label: "Payment" },
                ].map((step, index) => (
                  <React.Fragment key={step.num}>
                    <div className="flex items-center">
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                          currentStep >= step.num
                            ? "bg-primary border-primary text-white"
                            : "border-gray-300 text-gray-400"
                        }`}
                      >
                        {currentStep > step.num ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <span className="poppins font-semibold">
                            {step.num}
                          </span>
                        )}
                      </div>
                      <span
                        className={`ml-3 inter text-sm font-medium ${
                          currentStep >= step.num
                            ? "text-gray-900"
                            : "text-gray-500"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>

                    {index < 1 && (
                      <div
                        className={`w-20 h-0.5 ${
                          currentStep > step.num ? "bg-primary" : "bg-gray-300"
                        }`}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              {currentStep === 1 ? (
                /* STEP 1: PLAN SELECTION */
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-2xl border border-gray-200 p-6"
                >
                  <h2 className="poppins text-xl font-bold text-gray-900 mb-6">
                    Selected Plan
                  </h2>

                  {/* BILLING CYCLE SWITCH */}
                  <div className="relative w-fit bg-gray-100 rounded-2xl p-1 mb-6 shadow-inner">
                    <motion.div
                      layout
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                      }}
                      className={`absolute top-1 bottom-1 w-1/2 rounded-xl bg-white shadow-lg`}
                      style={{
                        left: billingCycle === "MONTHLY" ? "4px" : "calc(48%)",
                      }}
                    />

                    <div className="relative z-10 flex">
                      <button
                        onClick={() => setBillingCycle("MONTHLY")}
                        className={`w-24 py-2 text-sm font-semibold transition-colors ${
                          billingCycle === "MONTHLY"
                            ? "text-primary"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        Monthly
                      </button>

                      <button
                        onClick={() => setBillingCycle("ANNUAL")}
                        className={`w-24 py-2 text-sm font-semibold transition-colors ${
                          billingCycle === "ANNUAL"
                            ? "text-primary"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        Annual
                      </button>
                    </div>
                  </div>

                  {/* DISCOUNT BANNER */}
                  {billingCycle === "ANNUAL" && annualDiscount && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 250,
                        damping: 22,
                      }}
                      className="relative overflow-hidden rounded-xl p-4 mb-6 border border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 shadow-sm"
                    >
                      {/* Animated shimmer highlight */}
                      <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: "150%" }}
                        transition={{
                          repeat: Infinity,
                          duration: 3,
                          ease: "easeInOut",
                        }}
                        className="absolute inset-y-0 w-1/3 bg-white/10 blur-xl"
                      />

                      <div className="relative z-10 flex items-center space-x-3">
                        <div className="bg-primary/20 p-2 rounded-lg">
                          <ShieldCheck className="w-5 h-5 text-primary" />
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-primary inter">
                            Get {selectedPlan.discountForAnnually} percent off
                            when billed annually.
                          </p>
                          <p className="text-xs text-primary/70 mt-1 inter">
                            Best choice for long term users who want maximum
                            savings.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* PLAN CARD (MATURE, SAAS STYLE) */}
                  <div className="rounded-xl border border-gray-300 bg-gray-50 p-6 mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                      {selectedPlan.name}
                    </h3>
                    <p className="text-xs uppercase text-gray-500 tracking-wide mb-4">
                      {selectedPlan.description}
                    </p>

                    <div className="text-right mb-4">
                      <p className="poppins text-3xl font-bold text-gray-900">
                        ${getDiscountedPrice()}
                      </p>
                      <p className="text-xs text-gray-500 uppercase">
                        {billingCycle === "ANNUAL" ? "per year" : "per month"}
                      </p>
                    </div>

                    <PricingFeatures plan={selectedPlan} />
                  </div>
                  <div className="flex items-center space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate(-1)}
                      className="flex-1 border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-semibold inter hover:border-gray-400 transition-colors"
                    >
                      Back
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setCurrentStep(2)}
                      className="flex-1 bg-primary text-white py-3 px-6 rounded-xl font-semibold inter flex items-center justify-center space-x-2 hover:bg-primary/90 transition-colors"
                    >
                      <span>Continue to Payment</span>
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                /* STEP 2: PAYMENT METHOD */
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-2xl border border-gray-200 p-6"
                >
                  <h2 className="poppins text-xl font-bold text-gray-900 mb-6">
                    Choose Payment Method
                  </h2>

                  <div className="space-y-3 mb-6">
                    {mockPaymentGateways
                      .filter((gateway) => gateway.status === "ACTIVE")
                      .map((gateway) => (
                        <motion.div
                          key={gateway.uid}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => setSelectedGateway(gateway)}
                          className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all ${
                            selectedGateway?.uid === gateway.uid
                              ? "border-primary bg-primary/5"
                              : "border-gray-200 hover:border-primary/30"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="poppins font-semibold text-gray-900">
                                {gateway.name}
                              </p>
                              <p className="inter text-xs text-gray-600">
                                {gateway.description}
                              </p>
                            </div>

                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                selectedGateway?.uid === gateway.uid
                                  ? "border-primary bg-primary"
                                  : "border-gray-300"
                              }`}
                            >
                              {selectedGateway?.uid === gateway.uid && (
                                <Check className="w-3 h-3 text-white" />
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                  </div>

                  {isManualGateway && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6"
                    >
                      <div className="flex items-start space-x-3">
                        <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                        <div>
                          <p className="inter text-sm font-medium text-yellow-900 mb-1">
                            Manual Payment Instructions
                          </p>
                          <p className="inter text-xs text-yellow-700">
                            {selectedGateway?.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                    <div className="flex items-start space-x-3">
                      <ShieldCheck className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <p className="inter text-sm text-green-900">
                        Your payment information is secured with enterprise
                        encryption.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setCurrentStep(1)}
                      className="flex-1 border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-semibold inter hover:border-gray-400 transition-colors"
                    >
                      Back
                    </motion.button>

                    <motion.button
                      whileHover={canProceed ? { scale: 1.02 } : {}}
                      whileTap={canProceed ? { scale: 0.98 } : {}}
                      onClick={handleProceedToPayment}
                      disabled={!canProceed || isProcessing}
                      className={`flex-1 py-3 px-6 rounded-xl font-semibold inter flex items-center justify-center space-x-2 transition-colors ${
                        canProceed && !isProcessing
                          ? "bg-primary text-white hover:bg-primary/90"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-5 h-5" />
                          <span>Proceed to Payment</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ORDER SUMMARY */}
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
                      {billingCycle === "ANNUAL"
                        ? "Annual billing"
                        : "Monthly billing"}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="poppins text-xl font-bold text-gray-900">
                    ${getDiscountedPrice()}
                  </p>
                  <p className="text-xs text-gray-500 uppercase">
                    {billingCycle === "ANNUAL" ? "per year" : "per month"}
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="inter text-sm text-gray-600">Subtotal</span>
                  <span className="poppins font-semibold text-gray-900">
                    ${getDiscountedPrice()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="inter text-sm text-gray-600">Tax</span>
                  <span className="poppins font-semibold text-gray-900">
                    ${calculateTax(getDiscountedPrice())}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-6">
                <span className="poppins text-lg font-bold text-gray-900">
                  Total
                </span>
                <span className="poppins text-2xl font-bold text-primary">
                  ${calculateTotal()}
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
                  <Link
                    to="/privacy-policy"
                    className="text-primary hover:underline"
                  >
                    Privacy Policy
                  </Link>
                  . Your subscription will auto renew.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}

export default UpgradePlan;
