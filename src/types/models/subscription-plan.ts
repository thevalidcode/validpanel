import type { CurrencyCode } from "@/lib/currencyConverter";
import type { BillingInterval } from "./coupon";

export type SubscriptionPlanFeatures = {
  stores: number;
  products: number | null;
  staff_accounts: number;
  payment_gateways: number;
  available_templates: number;
  analytics: boolean;
  api_access: boolean;
  ai_features: boolean;
  priority_support: boolean;
  custom_branding: boolean;
  custom_domain: boolean;
  free_ssl: boolean;
  hide_platform_banner: boolean;
  custom_templates: boolean;
  unlimited_products: boolean;
  social_store_order_sync: boolean;
  social_store_service_sync: boolean;
  store_email_notifications: boolean;
  store_custom_emails: boolean;
  store_newsletters: boolean;
  max_shipping_accounts: number;
  reselling: boolean;
};

export type SubscriptionPlanStatus = "ACTIVE" | "INACTIVE" | "DRAFT";
export type SubscriptionPlanInterval = BillingInterval;

export interface PlanPrice {
  id: number;
  planId: number;
  interval: BillingInterval;
  price: string; // decimal string from backend
  tax?: number | null; // percentage integer (e.g. 7 for 7%)
  amountInMinor: number; // minor units, e.g. cents/kobo
  currency: CurrencyCode; // 3-letter uppercase
  externalId?: string | null;
  isActive: boolean;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionPlan {
  id: number;
  uid: string;
  name: string;
  description: string | null;
  status: SubscriptionPlanStatus;
  features: SubscriptionPlanFeatures;
  gracePeriod: number | null;
  createdAt: string;
  updatedAt: string;
  prices: PlanPrice[];
}
