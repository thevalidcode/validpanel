import type {
  SubscriptionPlan,
  SubscriptionPlanInterval,
} from "./subscription-plan";

export type SubscriptionStatus =
  | "ACTIVE"
  | "PENDING"
  | "EXPIRED"
  | "CANCELED"
  | "TRIAL";

export interface Subscription {
  id: number;
  uid: string;
  status: SubscriptionStatus;
  startedAt: string;
  billingCycle: SubscriptionPlanInterval;
  expiresAt: string;
  plan: SubscriptionPlan;
}
