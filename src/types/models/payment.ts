import type { PaymentMethod } from "./payment-gateway";
import type { SubscriptionPlan } from "./subscription-plan";

export type PaymentStatus = "SUCCESS" | "PENDING" | "FAILED";

export type Payment = {
  planId: number;
  id: number;
  uid: string;
  method: PaymentMethod;
  status: PaymentStatus;
  createdAt: Date;
  chargedAmount: string;
  currency: string;
  amount: string;
  userId: number;
  plan: SubscriptionPlan;
};
