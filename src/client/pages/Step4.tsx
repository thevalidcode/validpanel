import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ImageUploadBox from "@/components/ImageUploadBox";
import {
  getOnboardingDraft,
  setOnboardingDraft,
} from "@/utils/onboarding.utils";
import OnboardingLayout from "../components/onboarding/OnboardingLayout";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import ColorPicker from "@/components/ColorPicker";

const Step4: React.FC = () => {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string>("");
  const navigate = useNavigate();

  // Initialize from localStorage if draft exists
  useEffect(() => {
    const draft = getOnboardingDraft();
    if (draft) {
      setSelectedColor(draft.color || "");
      setLogoUrl(draft.logoUrl || "");
    }
  }, []);

  const handleContinue = (): void => {
    if (!selectedColor) return;
    setOnboardingDraft((prev) => ({
      ...prev,
      logoUrl,
      color: selectedColor,
      completedSteps: [...new Set([...(prev.completedSteps ?? []), 4])],
    }));
    navigate("/onboarding/step5");
  };

  const handleBack = (): void => {
    navigate("/onboarding/step3");
  };

  return (
    <OnboardingLayout
      title=" Let’s brand your store"
      description="Upload your logo and choose brand colors to make your store uniquely
          yours."
      step={4}
      selected={!!selectedColor}
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
        className="bg-white rounded-2xl shadow-lg p-8 mt-10 w-full max-w-3xl mx-auto"
      >
        <ImageUploadBox
          label="Brand Logo (Optional)"
          collection="store"
          onUploaded={(url) => setLogoUrl(url)}
        />

        {/* Brand Colors */}
        <h3 className="text-gray-800 font-semibold mb-3">Brand Color</h3>
        <p className="text-gray-500 text-sm mb-3">
          Choose a primary color that represents your brand
        </p>

        <ColorPicker
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
        />
      </motion.div>
    </OnboardingLayout>
  );
};

export default Step4;
