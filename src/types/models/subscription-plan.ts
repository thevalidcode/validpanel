import type { CurrencyCode } from "@/lib/currencyConverter";

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
  automated_shipping_allowed: boolean;
  max_shipping_accounts: number;
};

export type SubscriptionPlanStatus = "ACTIVE" | "INACTIVE";
export type SubscriptionPlanInterval = "MONTHLY" | "YEARLY";

export interface SubscriptionPlan {
  id: number;
  uid: string;
  name: string;
  gracePeriod: number | null;
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
