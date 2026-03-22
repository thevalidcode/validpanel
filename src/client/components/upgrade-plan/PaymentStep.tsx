import { motion } from "framer-motion";
import { Lock, AlertCircle, ShieldCheck } from "lucide-react";
import type { PaymentGateway, SubscriptionPlan } from "@/types";
import type { CouponAppliesTo } from "@/types/models/coupon";
import CustomCheckbox from "@/components/ui/CustomCheckbox";
import CouponCodeField from "@/components/coupons/CouponCodeField";
import CouponShowcase from "@/components/coupons/CouponShowcase";

interface PaymentStepProps {
  paymentGateways: PaymentGateway[];
  selectedGateway: PaymentGateway | null;
  selectedPlan: SubscriptionPlan | null;
  setSelectedGateway: (gateway: PaymentGateway) => void;
  canProceed: boolean;
  isProcessing: boolean;
  isManualGateway: boolean;
  onBack: () => void;
  onProceed: () => void;
  couponCode?: string;
  onCouponCodeChange?: (code: string) => void;
  onApplyCoupon?: () => void;
  isCouponApplying?: boolean;
  couponApplied?: boolean;
  couponMessage?: string;
  couponAppliesTo?: CouponAppliesTo;
  onUseSuggestedCoupon?: (code: string) => void;
  onRemoveSuggestedCoupon?: () => void;
}

function PaymentStep({
  paymentGateways,
  selectedGateway,
  setSelectedGateway,
  canProceed,
  isProcessing,
  isManualGateway,
  onBack,
  selectedPlan,
  onProceed,
  couponCode,
  onCouponCodeChange,
  onApplyCoupon,
  isCouponApplying,
  couponApplied,
  couponMessage,
  couponAppliesTo,
  onUseSuggestedCoupon,
  onRemoveSuggestedCoupon,
}: PaymentStepProps) {
  const isButtonDisabled = !canProceed || isProcessing;

  const buttonLabel =
    selectedPlan?.prices?.every((p) => Number(p.price) === 0)
      ? "Subscribe Now"
      : isProcessing
      ? "Processing..."
      : "Proceed to Payment";

  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white rounded-[4px] border border-gray-200 p-6"
    >
      <h2 className="poppins text-xl font-bold text-gray-900 mb-6">
        Choose Payment Method
      </h2>

      {/* PAYMENT GATEWAYS */}
      <div className="space-y-3 mb-6">
        {paymentGateways
          .filter((gateway) => gateway.status === "ACTIVE")
          .map((gateway) => (
            <div
              key={gateway.id}
              onClick={() => setSelectedGateway(gateway)}
              className={`flex items-center justify-between p-4 border rounded-[4px] cursor-pointer transition
                    ${
                      selectedGateway?.uid === gateway.uid
                        ? "border-purple-600 shadow-md bg-purple-50/50"
                        : "border-gray-200 hover:border-purple-300 bg-white"
                    }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center rounded-[4px] bg-gray-100">
                  <img
                    src={gateway.image}
                    alt={gateway.name}
                    className="w-6 h-6 object-contain"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">
                    {gateway.name}
                  </h4>
                  <p className="text-sm text-gray-500">{gateway.description}</p>
                </div>
              </div>
              <CustomCheckbox
                checked={selectedGateway?.uid === gateway.uid}
                onChange={(checked) => {
                  if (checked) setSelectedGateway(gateway);
                }}
                className="pointer-events-none" // Handle click via parent div
              />
            </div>
          ))}
      </div>

      {/* MANUAL PAYMENT INFO */}
      {selectedGateway?.content && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-yellow-50 border border-yellow-200 rounded-[4px] p-4 mb-6"
        >
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
            <div>
              <p className="inter text-sm font-medium text-yellow-900 mb-1">
                Manual Payment Instructions
              </p>
              <p className="inter text-xs text-yellow-700">
                {selectedGateway.content}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {onCouponCodeChange && onApplyCoupon && (
        <div className="mb-6 space-y-3">
          <CouponCodeField
            value={couponCode || ""}
            onChange={onCouponCodeChange}
            onApply={onApplyCoupon}
            isApplying={isCouponApplying}
            applied={couponApplied}
            message={couponMessage}
            disabled={isProcessing}
          />

          <CouponShowcase
            context="SUBSCRIPTION_PAGE"
            appliesTo={couponAppliesTo}
            variant="compact"
            title="Quick Apply Offers"
            selectedCode={couponCode}
            isApplying={isCouponApplying}
            onUseCoupon={(coupon) => {
              if (!onUseSuggestedCoupon) return;
              onUseSuggestedCoupon(coupon.code);
            }}
            onRemoveCoupon={() => {
              if (!onRemoveSuggestedCoupon) return;
              onRemoveSuggestedCoupon();
            }}
          />
        </div>
      )}

      {/* SECURITY NOTICE */}
      <div className="bg-green-50 border border-green-200 rounded-[4px] p-4 mb-6">
        <div className="flex items-start space-x-3">
          <ShieldCheck className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="inter text-sm text-green-900">
            Your payment information is secured with enterprise encryption.
          </p>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex items-center space-x-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onBack}
          className="flex-1 border-2 border-gray-300 text-sm text-gray-700 py-3 px-6 rounded-[4px] font-semibold hover:border-gray-400 transition-colors"
        >
          Back
        </motion.button>

        <motion.button
          whileHover={!isButtonDisabled ? { scale: 1.02 } : {}}
          whileTap={!isButtonDisabled ? { scale: 0.98 } : {}}
          onClick={onProceed}
          disabled={isButtonDisabled}
          className={`flex-1 py-3 px-6 text-sm rounded-[4px] font-semibold flex items-center justify-center space-x-2 transition-colors ${
            !isButtonDisabled
              ? "bg-primary text-white hover:bg-primary/90"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {isProcessing && !isManualGateway ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              {selectedPlan?.prices?.some((p) => Number(p.price) > 0) && (
                <Lock className="w-5 h-5" />
              )}
              <span>{buttonLabel}</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

export default PaymentStep;
