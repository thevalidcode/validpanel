export type BillingInterval = "MONTHLY" | "YEARLY";
export type DiscountType = "PERCENTAGE" | "FIXED";
export type CouponAppliesTo = "NEW" | "RENEWAL" | "UPGRADE";

import type { CurrencyCode } from "@/lib/currencyConverter";

export interface CouponRule {
  id?: number;
  couponId?: number;
  planId: number | null;
  interval: BillingInterval | null;
  currency: string | null;
  region: string | null;
  createdAt?: string;
}

export interface Coupon {
  id: number;
  uid: string;
  code: string;
  type: DiscountType;
  value: string; // decimal string
  currency: CurrencyCode | null;
  maxUses: number | null;
  usedCount: number;
  perUserLimit: number | null;
  isActive: boolean;
  startsAt: string | null;
  expiresAt: string | null;
  minAmount: number | null; // minor units
  firstTimeOnly: boolean;
  createdAt: string;
  updatedAt: string;
  rules: CouponRule[];
  contexts: string[]; //HOME_PAGE, PRICING_PAGE
  isPublic: boolean;
  priority: number;
  autoApply: boolean;
  highlightText?: string;
  appliesTo: CouponAppliesTo[];
}

export interface CouponRedemption {
  id: number;
  couponId: number;
  userId: number;
  subscriptionId: number | null;
  amountSaved: number; // minor units
  createdAt: string;
}
