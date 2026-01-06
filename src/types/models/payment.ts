import type { CurrencyCode } from "@/lib/currencyConverter";
import type { PaymentMethod } from "./payment-gateway";
import type { SubscriptionPlan } from "./subscription-plan";
import type { User } from "./user";

export type PaymentStatus = "SUCCESS" | "PENDING" | "FAILED";

export type Payment = {
  planId: number;
  id: number;
  uid: string;
  method: PaymentMethod;
  status: PaymentStatus;
  createdAt: Date;
  chargedAmount: string;
  currency: CurrencyCode;
  amount: string;
  userId: number;
  user: User;
  plan: SubscriptionPlan;
};
