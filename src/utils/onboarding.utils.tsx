import type {
  PaymentMethod,
  StoreType,
  SubscriptionPlanInterval,
} from "@/types";

export type OnboardingDraft = {
  planUid?: string;
  couponCode?: string;
  couponSource?: "URL" | "MANUAL" | "SUGGESTED"; // Track coupon origin
  storeType?: StoreType;
  storeName?: string;
  currency?: string;
  domain?: string;
  logoUrl?: string;
  color?: string;
  subscriptionInterval: SubscriptionPlanInterval;
  selectedPayment?: PaymentMethod;
  completedSteps: number[];
};

const KEY = "onboarding_draft_v1";

export function getOnboardingDraft(): OnboardingDraft | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as OnboardingDraft) : null;
  } catch {
    return null;
  }
}

export function setOnboardingDraft(
  updater: (prev: OnboardingDraft) => OnboardingDraft,
) {
  const current = getOnboardingDraft() ?? {
    completedSteps: [],
    subscriptionInterval: "MONTHLY",
  };
  const next = updater(current);
  localStorage.setItem(KEY, JSON.stringify(next));
}

export function clearOnboardingDraft() {
  localStorage.removeItem(KEY);
}

/**
 * Extract coupon code from URL params and inject into draft
 * Useful for coupon-code-gated onboarding links like /onboarding?coupon=SAVE20
 */
export function initializeDraftFromCouponParam(
  couponCode: string | null,
): void {
  if (!couponCode) return;

  setOnboardingDraft((prev) => ({
    ...prev,
    couponCode: couponCode.trim().toUpperCase(),
    couponSource: "URL",
  }));
}

/**
 * Build onboarding redirect with coupon param preserved
 * Used after login/register to resume onboarding flow
 */
export function buildOnboardingRedirectWithCoupon(
  couponCode?: string,
  stepNumber: number = 1,
): string {
  const params = new URLSearchParams();
  if (couponCode) {
    params.append("coupon", couponCode);
  }
  const queryStr = params.toString();
  return `/onboarding/step${stepNumber}${queryStr ? "?" + queryStr : ""}`;
}
