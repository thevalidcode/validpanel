import type { CurrencyCode } from "@/lib/currencyConverter";

export type SubscriptionPlanFeatures = {
  stores?: number;
  products?: number | null;
  analytics?: boolean;
  custom_branding?: boolean;
  priority_support?: boolean;
  store_analytics?: boolean;
  unlimited_products?: boolean;
  hide_banner?: boolean;
  api_access?: boolean;
  custom_domain?: boolean;
  ai_features?: boolean;
  customer_emails?: boolean;
  free_ssl?: boolean;
  available_templates?: number;
  payment_gateways?: number;
  default_template?: boolean;
  staff_accounts?: number;
  custom_templates?: boolean;
  order_syncing_for_social_media_store?: boolean;
};

export type SubscriptionPlanStatus = "ACTIVE" | "INACTIVE";
export type SubscriptionPlanInterval = "MONTHLY" | "YEARLY";

export interface SubscriptionPlan {
  id: number;
  uid: string;
  name: string;
  gracePeriod:"",
  price: string;
  currency: CurrencyCode;
  description: string | null;
  status: SubscriptionPlanStatus;
  features: SubscriptionPlanFeatures;
  interval: SubscriptionPlanInterval;
  discountForAnnually: number | null;
  tax: number | null;
  createdAt: Date;
  updatedAt: Date;
}
