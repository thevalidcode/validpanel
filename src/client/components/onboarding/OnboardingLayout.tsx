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
      document.title = `${title} | ValidPanel`;
    }
  }, [title]);

  if (isAuthLoading) {
    return <Loader />;
  }
  const progress = Math.min(step / totalSteps, 1);

  const isFirstStep = step === 1;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50/50">
      <div className="w-full max-w-4xl xl:max-w-6xl px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <img src={logoSrc} alt="Logo" className="h-10 w-auto" />
          </div>
          {title && (
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                {title}
              </h2>
              <p className="text-gray-500 text-sm max-w-md mx-auto">
                {description}
              </p>
            </div>
          )}
        </div>

        {/* Card */}
        <div className="bg-white rounded-[4px] border border-gray-200 shadow-sm p-8 sm:p-12 relative overflow-hidden">
          {/* Progress Bar (Subtle) */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gray-100">
            <motion.div
              className="h-full bg-[var(--color-primary)]"
              initial={{ width: 0 }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>

          <div className="absolute top-4 right-4 text-xs font-medium text-gray-400">
            Step {step} of {totalSteps}
          </div>

          {/* Content Area */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="py-4"
          >
            {children}
          </motion.div>

          {/* Footer / Navigation */}
          <div className="mt-12 flex items-center justify-between pt-6 border-t border-gray-100">
            {/* Back Button */}
            <div>
              {!isFirstStep && onBack && (
                <button
                  onClick={onBack}
                  className="px-6 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2 rounded-[4px] hover:bg-gray-50"
                >
                  {backButton || "Back"}
                </button>
              )}
            </div>

            {/* Next Button */}
            {onNext && (
              <button
                onClick={onNext}
                disabled={!selected}
                className={`px-8 py-2.5 text-sm font-medium rounded-[4px] shadow-sm transition-all focus:ring-1 focus:ring-offset-2 focus:ring-[var(--color-primary)] flex items-center gap-2
                        ${
                          selected
                            ? "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90 translate-y-[0px] active:translate-y-[1px]"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                        }`}
              >
                {nextButton || "Continue"}
              </button>
            )}
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} ValidPanel. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnboardingLayout;
