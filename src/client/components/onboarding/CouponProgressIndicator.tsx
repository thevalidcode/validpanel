import React from "react";
import { Tag, CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

interface CouponProgressIndicatorProps {
  couponCode?: string;
  discountInfo?: {
    discountPercentage?: number;
    discountAmount?: string;
  };
  isValid?: boolean;
  className?: string;
  variant?: "full" | "compact" | "inline";
}

/**
 * Displays the current coupon status and discount being applied
 * Shows at each onboarding step to reassure users about the offer
 */
export const CouponProgressIndicator: React.FC<
  CouponProgressIndicatorProps
> = ({
  couponCode,
  discountInfo,
  isValid = true,
  className = "",
  variant = "compact",
}) => {
  if (!couponCode) return null;

  // Compact version for step display
  if (variant === "compact") {
    return (
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-[6px] border border-green-200 bg-green-50 px-3 py-2 flex items-center gap-2 ${className}`}
      >
        <Tag className="w-4 h-4 text-green-600" />
        <div className="text-sm">
          <span className="font-semibold text-green-700">
            {couponCode.toUpperCase()}
          </span>
          {discountInfo?.discountPercentage && (
            <span className="ml-2 text-green-600">
              ({discountInfo.discountPercentage}% off)
            </span>
          )}
        </div>
        {isValid && <CheckCircle2 className="w-4 h-4 text-green-600 ml-auto" />}
      </motion.div>
    );
  }

  // Full card version
  if (variant === "full") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`rounded-[8px] border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-4 ${className}`}
      >
        <div className="flex items-start gap-3">
          <div className="pt-1">
            {isValid ? (
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-600" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-green-900">
              Coupon Applied: {couponCode.toUpperCase()}
            </p>
            {discountInfo?.discountPercentage && (
              <p className="text-sm text-green-700 mt-1">
                You'll save {discountInfo.discountPercentage}% on your
                subscription
              </p>
            )}
            {discountInfo?.discountAmount && (
              <p className="text-sm text-green-700 mt-1">
                Discount: {discountInfo.discountAmount}
              </p>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // Inline version (minimal)
  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 ${className}`}
    >
      <Tag className="w-3 h-3" />
      {couponCode.toUpperCase()}
      {discountInfo?.discountPercentage && (
        <span>({discountInfo.discountPercentage}% off)</span>
      )}
    </div>
  );
};

interface OnboardingStepGuideProps {
  couponCode?: string;
  showCouponHint?: boolean;
  children: React.ReactNode;
}

/**
 * Wraps step content with visual guidance about the coupon flow
 * Shows progress context and helpful hints
 */
export const OnboardingStepGuide: React.FC<OnboardingStepGuideProps> = ({
  couponCode,
  showCouponHint = true,
  children,
}) => {
  return (
    <div className="relative">
      {/* Coupon retention notice */}
      {couponCode && showCouponHint && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-[8px] border border-blue-100 bg-blue-50/50 px-4 py-3 text-sm text-blue-800 flex items-start gap-2"
        >
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-600" />
          <p>
            Your coupon{" "}
            <span className="font-semibold">{couponCode.toUpperCase()}</span> is
            preserved throughout this setup process and will be applied to your
            subscription.
          </p>
        </motion.div>
      )}

      {/* Main content */}
      {children}
    </div>
  );
};

/**
 * Progress hint showing the steps remaining
 */
interface OnboardingProgressHintProps {
  currentStep: number;
  totalSteps?: number;
  milestone?: string; // e.g., "Almost there! 2 steps left"
}

export const OnboardingProgressHint: React.FC<OnboardingProgressHintProps> = ({
  currentStep,
  totalSteps = 6,
  milestone,
}) => {
  const stepsRemaining = totalSteps - currentStep;
  const progressPercent = (currentStep / totalSteps) * 100;

  let hintText = milestone;
  if (!milestone) {
    if (stepsRemaining === 0) {
      hintText = "You're all set!";
    } else if (stepsRemaining === 1) {
      hintText = "Almost there! Final step ahead.";
    } else if (stepsRemaining <= 2) {
      hintText = `Just ${stepsRemaining} more step${stepsRemaining > 1 ? "s" : ""}!`;
    } else {
      hintText = `${stepsRemaining} steps to launch your store.`;
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-2"
    >
      {/* Progress bar */}
      <div className="h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
        />
      </div>

      {/* Hint text */}
      <p className="text-sm text-gray-600 text-center">
        {hintText} ({currentStep}/{totalSteps})
      </p>
    </motion.div>
  );
};

/**
 * Helpful tooltip for guiding users through the coupon onboarding flow
 */
interface OnboardingTooltipProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  variant?: "info" | "success" | "warning";
  className?: string;
}

export const OnboardingTooltip: React.FC<OnboardingTooltipProps> = ({
  title,
  description,
  icon,
  variant = "info",
  className = "",
}) => {
  const variantStyles = {
    info: "border-blue-200 bg-blue-50 text-blue-900",
    success: "border-green-200 bg-green-50 text-green-900",
    warning: "border-amber-200 bg-amber-50 text-amber-900",
  };

  const iconColor = {
    info: "text-blue-600",
    success: "text-green-600",
    warning: "text-amber-600",
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className={`rounded-[6px] border p-3 ${variantStyles[variant]} ${className}`}
    >
      <div className="flex gap-2">
        {icon && (
          <div className={`flex-shrink-0 ${iconColor[variant]}`}>{icon}</div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">{title}</p>
          <p className="text-xs mt-1 opacity-85">{description}</p>
        </div>
      </div>
    </motion.div>
  );
};
