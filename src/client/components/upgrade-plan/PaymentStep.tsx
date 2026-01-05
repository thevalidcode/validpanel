import { motion } from "framer-motion";
import {  Lock, AlertCircle, ShieldCheck } from "lucide-react";
import type { PaymentGateway, SubscriptionPlan } from "@/types";

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
}: PaymentStepProps) {
  const isButtonDisabled = !canProceed || isProcessing;

  const buttonLabel =
    Number(selectedPlan?.price) === 0
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
      className="bg-white rounded-2xl border border-gray-200 p-6"
    >
      <h2 className="poppins text-xl font-bold text-gray-900 mb-6">
        Choose Payment Method
      </h2>

      {/* PAYMENT GATEWAYS */}
      <div className="space-y-3 mb-6">
        {paymentGateways
          .filter((gateway) => gateway.status === "ACTIVE")
          .map((gateway) => (
            <label
              key={gateway.id}
              className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition
                    ${
                      selectedGateway?.uid === gateway.uid
                        ? "border-purple-600 shadow-md"
                        : "border-gray-200 hover:border-purple-300"
                    }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100">
                  <img
                    src={gateway.image}
                    alt={gateway.name}
                    className="w-6 h-6"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">
                    {gateway.name}
                  </h4>
                  <p className="text-sm text-gray-500">{gateway.description}</p>
                </div>
              </div>
              <input
                type="radio"
                name="payment"
                className="accent-purple-600"
                checked={selectedGateway?.uid === gateway.uid}
                onChange={() => setSelectedGateway(gateway)}
              />
            </label>
          ))}
      </div>

      {/* MANUAL PAYMENT INFO */}
      {selectedGateway?.content && (
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
                {selectedGateway.content}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* SECURITY NOTICE */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
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
          className="flex-1 border-2 border-gray-300 text-sm text-gray-700 py-3 px-6 rounded-xl font-semibold hover:border-gray-400 transition-colors"
        >
          Back
        </motion.button>

        <motion.button
          whileHover={!isButtonDisabled ? { scale: 1.02 } : {}}
          whileTap={!isButtonDisabled ? { scale: 0.98 } : {}}
          onClick={onProceed}
          disabled={isButtonDisabled}
          className={`flex-1 py-3 px-6 text-sm rounded-xl font-semibold flex items-center justify-center space-x-2 transition-colors ${
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
              {Number(selectedPlan?.price) !== 0 && (
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
