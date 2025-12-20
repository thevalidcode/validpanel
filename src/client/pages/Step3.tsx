import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import DomainInput from "../components/DomainInput";
import {
  getOnboardingDraft,
  setOnboardingDraft,
} from "@/utils/onboarding.utils";
import { useGetUserSubscriptionPlanByUid } from "@/hooks/use-subscription-plan";
import OnboardingLayout from "../components/onboarding/OnboardingLayout";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const Step3: React.FC = () => {
  const navigate = useNavigate();

  const [storeName, setStoreName] = useState<string>("");
  const [domain, setDomain] = useState<string>("");
  const [useCustomDomain, setUseCustomDomain] = useState<boolean>(false);
  const draft = getOnboardingDraft();
  const { data: subscriptionPlan } = useGetUserSubscriptionPlanByUid(
    draft?.planUid || ""
  );

  // Initialize from localStorage if draft exists
  useEffect(() => {
    if (draft) {
      setDomain(draft.domain?.replace(".validpanel.com", "") || "");
      setStoreName(draft.storeName || "");
    }
  }, []);

  const handleContinue = (): void => {
    if (!domain || !storeName) return;

    setOnboardingDraft((prev) => ({
      ...prev,
      storeName,
      domain: useCustomDomain
        ? domain.trim()
        : domain.trim().toLowerCase() + ".validpanel.com",

      completedSteps: [...new Set([...(prev.completedSteps ?? []), 3])],
    }));

    navigate("/onboarding/step4");
  };

  const handleToggleDomain = (): void => {
    setUseCustomDomain((prev) => !prev);
  };

  return (
    <OnboardingLayout
      title="Name Your Store"
      description="Give your store a name and choose your custom link."
      step={3}
      selected={!!domain && !!storeName}
      onNext={handleContinue}
      onBack={() => navigate("/onboarding/step2")}
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
      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-lg rounded-2xl p-6 sm:p-8 w-full mx-auto max-w-md sm:max-w-xl md:max-w-2xl"
      >
        {/* Store Name */}
        <div className="mb-6">
          <label
            htmlFor="storeName"
            className="block text-gray-700 font-medium mb-2 text-sm sm:text-base"
          >
            Store Name
          </label>
          <input
            id="storeName"
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            placeholder="Enter your store name"
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm sm:text-base focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Domain Setup */}
        <DomainInput
          label="Domain Setup"
          value={domain}
          onChange={setDomain}
          useCustomDomain={useCustomDomain}
          showUseCustomDomain={
            subscriptionPlan?.features?.custom_domain ?? false
          }
          onToggleCustomDomain={handleToggleDomain}
          required
        />
      </motion.div>
    </OnboardingLayout>
  );
};

export default Step3;
