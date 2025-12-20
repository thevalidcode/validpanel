import type { CurrencyCode } from "@/lib/currencyConverter";

export type UserStatus = "ACTIVE" | "INACTIVE" | "BANNED";
export type OnboardingStep = "PLAN" | "PAYMENT" | "STORE_DETAILS" | "COMPLETE";

export type User = {
  id: number;
  refCode: number | null;
  uid: string;
  phoneNumber: string;
  email: string;
  fullName: string;
  image: string | null;
  onboardingStep: OnboardingStep;
  apiKey: string;
  status: UserStatus;
  balance: string;
  spent: string;
  timestamp: string;
  lastSeen: string;
  currency: CurrencyCode;
  ref: number | null;
};
