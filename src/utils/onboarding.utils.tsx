import type {
  PaymentMethod,
  StoreType,
  SubscriptionPlanInterval,
} from "@/types";

export type OnboardingDraft = {
  planUid?: string;
  couponCode?: string;
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
  updater: (prev: OnboardingDraft) => OnboardingDraft
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
