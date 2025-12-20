import React, { useEffect, type ReactNode } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/useAppContext";
import Loader from "@/components/Loader";

interface OnboardingLayoutProps {
  title?: string;
  description?: string;
  step: number;
  totalSteps?: number;
  selected?: boolean;
  onNext?: () => void;
  onBack?: () => void;
  children?: ReactNode;
  logoSrc?: string;
  nextButton?: ReactNode; // Custom Next button content
  backButton?: ReactNode; // Custom Back button content
}

const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  title,
  description,
  step,
  totalSteps = 7,
  selected = false,
  onNext,
  onBack,
  children,
  logoSrc = "/Valid2.svg",
  nextButton,
  backButton,
}) => {
  const { userInfo, isAuthLoading } = useAppContext();

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthLoading) return;

    if (!userInfo) {
      navigate("/");
      return;
    }

    if (userInfo.onboardingStep === "COMPLETE") {
      navigate("/analytics");
    }
  }, [isAuthLoading, userInfo, navigate]);

  useEffect(() => {
    if (title) {
      document.title = `${title} | Valid Panel`;
    }
  }, [title]);

  if (isAuthLoading) {
    return <Loader />;
  }
  const progress = Math.min(step / totalSteps, 1);

  const isFirstStep = step === 1;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-[linear-gradient(to_right,#d4b2ff_40%,#ffffff_30%,#d4b2ff_100%)]">
      <div className="max-w-7xl w-full">
        {/* Header */}
        <div className="lg:flex sm:grid grid-cols-1 items-center justify-between p-8">
          <div className="flex items-center space-x-2">
            <img src={logoSrc} alt="Logo" />
          </div>
          {title && (
            <div className="flex flex-col items-center mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
              <p className="text-gray-500 mt-2">{description}</p>
            </div>
          )}
          <div className="w-16"></div> {/* Spacer */}
        </div>

        {/* Progress Bar */}
        <div className="px-2 md:px-12 mb-4">
          <h3 className="font-semibold text-lg text-gray-800 mb-2">
            Step {step}
          </h3>
          <div className="w-full bg-white h-2 rounded-full">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="px-2 md:px-12 mb-8">{children}</div>

        {/* Navigation Buttons */}
        <div className="flex justify-evenly px-2 md:px-12 pb-8">
          {/* Back Button */}
          {!isFirstStep && onBack && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="mt-12 font-semibold px-6 py-3 rounded-xl shadow-md bg-gray-200 hover:bg-gray-300 text-gray-800 transition flex items-center space-x-2"
            >
              {backButton || "Back"}
            </motion.button>
          )}

          {/* Next Button */}
          {onNext && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNext}
              disabled={!selected}
              className={`mt-12 font-semibold px-6 py-3 rounded-xl shadow-md transition flex items-center space-x-2
              ${
                selected
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            >
              {nextButton || "Next"}
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingLayout;
