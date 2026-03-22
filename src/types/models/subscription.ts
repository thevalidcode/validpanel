import type { SubscriptionPlan } from "./subscription-plan";
import type { BillingInterval } from "./coupon";

export type SubscriptionStatus =
  | "ACTIVE"
  | "PENDING"
  | "FAILED"
  | "EXPIRED"
  | "TRIAL"
  | "PAST_DUE"
  | "CANCELED";

export interface Subscription {
  id: number;
  uid: string;
  userId: number;
  planId: number;
  pendingPlanId: number | null;
  status: SubscriptionStatus;
  billingCycle: BillingInterval;
  startedAt: string;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  renewalProcessingAt: string | null;
  renewedAt: string | null;
  plan?: SubscriptionPlan;
  user?: {
    id: number;
    uid: string;
    email: string;
    fullName: string;
    image: string | null;
  };
}
