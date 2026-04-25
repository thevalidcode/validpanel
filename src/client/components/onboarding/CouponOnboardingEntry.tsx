import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Zap, Lock, Gift } from "lucide-react";
import { useAppContext } from "@/context/useAppContext";
import Loader from "@/components/Loader";
import { motion } from "framer-motion";
import { initializeDraftFromCouponParam } from "@/utils/onboarding.utils";

/**
 * Entry point for coupon-gated onboarding links
 * Route: /onboarding?coupon=SAVE20
 *
 * If user is logged in: proceed to step1 with coupon pre-filled
 * If user is NOT logged in: show coupon context, then redirect to login
 */
const CouponOnboardingEntry: React.FC = () => {
  const navigate = useNavigate();
  const { userInfo, isAuthLoading } = useAppContext();
  const [searchParams] = useSearchParams();
  const couponCode = searchParams.get("coupon");

  const [showCouponInfo, setShowCouponInfo] = useState(false);

  // Auto-redirect logic based on auth state and coupon
  useEffect(() => {
    if (isAuthLoading) return;

    // Initialize draft with coupon if present
    if (couponCode) {
      initializeDraftFromCouponParam(couponCode);
      setShowCouponInfo(true);

      // If logged in, go straight to onboarding step1
      if (userInfo) {
        setTimeout(() => {
          navigate(`/onboarding/step1?coupon=${couponCode}`);
        }, 2000);
        return;
      }

      // If not logged in, show coupon info briefly then redirect to login
      setTimeout(() => {
        navigate(`/login?coupon=${couponCode}&redirect=/onboarding/step1`);
      }, 3500);
      return;
    }

    // No coupon code provided, just proceed
    if (userInfo) {
      navigate("/onboarding/step1");
    } else {
      navigate("/login?redirect=/onboarding/step1");
    }
  }, [isAuthLoading, userInfo, couponCode, navigate]);

  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <Loader />
      </div>
    );
  }

  // Coupon info display (before redirect)
  if (showCouponInfo && couponCode && !userInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full"
        >
          {/* Coupon Card */}
          <div className="rounded-[12px] border border-purple-200 bg-white shadow-lg p-8 text-center space-y-6">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-purple-100 rounded-full blur-xl opacity-50" />
                <div className="relative bg-gradient-to-br from-purple-500 to-blue-500 w-20 h-20 rounded-full flex items-center justify-center">
                  <Gift className="w-10 h-10 text-white" />
                </div>
              </div>
            </div>

            {/* Coupon Code */}
            <div>
              <p className="text-sm uppercase tracking-wide text-gray-500 mb-2">
                Special Offer
              </p>
              <div className="inline-block rounded-[8px] border-2 border-dashed border-purple-300 px-4 py-3 bg-purple-50">
                <code className="text-2xl font-bold text-purple-600">
                  {couponCode?.toUpperCase()}
                </code>
              </div>
            </div>

            {/* Discount Info */}
            <div className="bg-green-50 border border-green-200 rounded-[8px] p-4">
              <p className="text-sm text-gray-700">
                Apply this coupon code when you create your store. The discount
                will be calculated based on your plan selection.
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <p className="text-gray-700 font-semibold">
                Exclusive Onboarding Offer
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                This coupon code will be automatically applied when you create
                your store. Just log in or sign up to continue.
              </p>
            </div>

            {/* Progress */}
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Lock className="w-4 h-4" />
              <span>Redirecting in a moment...</span>
            </div>

            {/* Divider */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                No account yet?{" "}
                <span className="font-semibold text-purple-600">
                  Create one in seconds
                </span>
              </p>
            </div>
          </div>

          {/* Trust badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-8 text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs text-gray-600 shadow-sm">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Secure onboarding • No hidden fees</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Fallback: should not normally render (auto-redirect happens)
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <Loader />
    </div>
  );
};

export default CouponOnboardingEntry;
