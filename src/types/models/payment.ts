import type { CurrencyCode } from "@/lib/currencyConverter";
import type { PaymentMethod } from "./payment-gateway";
import type { SubscriptionPlan } from "./subscription-plan";
import type { DiscountType } from "./coupon";

export type PaymentStatus = "SUCCESS" | "PENDING" | "FAILED";

export interface Payment {
  id: number;
  uid: string;
  userId: number;
  planId: number;
  subscriptionId: number | null;
  method: PaymentMethod;
  status: PaymentStatus;
  createdAt: string;
  currency: CurrencyCode;
  amount: string;
  chargedAmount: string;
  discountAmount: string;
  taxAmount: string | null;
  finalAmount: string;
  couponId: number | null;
  // present in list endpoints via include
  plan?: SubscriptionPlan;
  user?: {
    id: number;
    uid: string;
    email: string;
    fullName: string;
    image: string | null;
  };
  coupon?: {
    type: DiscountType;
    value: string;
    code: string;
    currency: string | null;
  };
}
