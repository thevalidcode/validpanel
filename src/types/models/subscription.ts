import type { SubscriptionPlan } from "./subscription-plan";

export interface Subscription {
  uid: string;
  status: "ACTIVE" | "PENDING" | "EXPIRED" | "CANCELED" | "TRIAL";
  startedAt: string;
  expiresAt: string;
  plan: SubscriptionPlan;
}
