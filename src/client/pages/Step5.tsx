import React, { useEffect, useState, type JSX } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  getOnboardingDraft,
  setOnboardingDraft,
} from "@/utils/onboarding.utils";
import OnboardingLayout from "../components/onboarding/OnboardingLayout";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

interface PaymentMethod {
  id: number;
  name: string;
  description: string;
  platform: "MANUAL" | "FLUTTERWAVE";
  icon: JSX.Element;
  details: JSX.Element;
}

const Step5: React.FC = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const navigate = useNavigate();
  // Initialize from localStorage if draft exists
  useEffect(() => {
    const draft = getOnboardingDraft();
    if (draft) {
      setSelected(draft.paymentMethod || "");
    }
  }, []);

  const handleContinue = (): void => {
    if (!selected) return;
    setOnboardingDraft((prev) => ({
      ...prev,
      paymentMethod: selected,
      completedSteps: [...new Set([...(prev.completedSteps ?? []), 5])],
    }));
    navigate("/onboarding/step6");
  };

  const handleBack = (): void => {
    navigate("/onboarding/step4"); // go back to previous step
  };

  const paymentMethods: PaymentMethod[] = [
    {
      id: 1,
      name: "Bank Transfer",
      platform: "MANUAL",
      description: "Direct bank account transfers",
      icon: <img src="/Frame.svg" alt="bank" className="w-7 h-7" />,
      details: (
        <div className="mt-4 text-sm text-gray-600 grid grid-cols-1 sm:grid-cols-2 gap-y-3">
          <p>
            <span className="text-gray-800">Bank Name:</span> <br />
            <span className="font-bold">
              First Bank <br />
              of Nigeria
            </span>
          </p>
          <p>
            <span className="text-gray-800 sm:ml-8">Account Number:</span>{" "}
            <br />
            <span className="font-bold sm:ml-8">1234567890</span>
          </p>
          <p>
            <span className="text-gray-800">Account Name:</span> <br />
            <span className="font-bold">
              Your Business <br /> Name
            </span>
          </p>
          <p>
            <span className="text-gray-800 sm:ml-8">Sort Code:</span> <br />
            <span className="font-bold sm:ml-8">011-151-003</span>
          </p>
        </div>
      ),
    },
    {
      id: 2,
      name: "Flutterwave",
      platform: "FLUTTERWAVE",
      description: "Accept cards and online payments",
      icon: <img src="/svg.svg" alt="flutterwave" className="w-7 h-7" />,
      details: (
        <div className="flex items-center gap-2 mt-3">
          <img src="/Secureicon.svg" alt="secure" className="w-4 h-4" />
          <span className="text-green-600 text-sm font-medium">
            Secure payment processing
          </span>
        </div>
      ),
    },
  ];

  return (
    <OnboardingLayout
      title="Set Your Payment Method"
      description="Choose how you want to receive payments from your customers."
      step={5}
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
      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white rounded-2xl shadow-md p-6 sm:p-8 w-full max-w-md sm:max-w-xl lg:max-w-2xl mx-auto"
      >
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            onClick={() => setSelected(method.platform)}
            className={`border rounded-xl p-5 mb-5 cursor-pointer transition-all duration-300 ${
              selected === method.platform
                ? "border-purple-600 shadow-purple-200 shadow-sm"
                : "border-gray-200 hover:border-purple-300"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start gap-3">
              <input
                title="method"
                type="radio"
                checked={selected === method.platform}
                onChange={() => setSelected(method.platform)}
                className="accent-purple-600 mt-1"
              />
              <div className="flex items-start gap-3 flex-1">
                <div className="bg-gray-100 p-2 rounded-lg">{method.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {method.name}
                  </h3>
                  <p className="text-gray-500 text-sm">{method.description}</p>
                  {method.details}
                </div>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </OnboardingLayout>
  );
};

export default Step5;
