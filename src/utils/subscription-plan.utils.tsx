import type { SubscriptionPlanFeatures } from "@/types";

type FeatureFormatter = (
  value: any,
  features: SubscriptionPlanFeatures
) => string | null;
const FEATURE_MAP: Record<keyof SubscriptionPlanFeatures, FeatureFormatter> = {
  stores: (value: number) => `Launch up to ${value} stores`,

  products: (value: number | null) =>
    value === null ? null : `Upload up to ${value} products per store`,

  unlimited_products: (value: boolean) =>
    value ? "Unlimited products per store" : null,

  available_templates: (value: number) =>
    `Access ${value} professionally designed templates`,

  payment_gateways: (value: number) => `Use up to ${value} payment gateways`,

  staff_accounts: (value: number) =>
    value > 0 ? `Add up to ${value} staff accounts` : null,

  analytics: (value: boolean) => (value ? "Basic analytics dashboard" : null),

  api_access: (value: boolean) =>
    value ? "API access for integrations" : null,

  ai_features: (value: boolean) =>
    value ? "AI-powered automation features" : null,

  priority_support: (value: boolean) =>
    value ? "Priority customer support" : null,

  store_email_notifications: (value: boolean) =>
    value ? "Automated customer email notifications" : null,

  store_custom_emails: (value: boolean) =>
    value ? "Custom email templates" : null,

  store_newsletters: (value: boolean) =>
    value ? "Newsletter management" : null,

  free_ssl: (value: boolean) =>
    value ? "Free SSL security on all stores" : null,

  custom_domain: (value: boolean) => (value ? "Connect a custom domain" : null),

  custom_branding: (value: boolean) => (value ? "Custom branding" : null),

  hide_platform_banner: (value: boolean) =>
    value ? "Hide platform promotional banners" : null,

  custom_templates: (value: boolean) =>
    value ? "Upload custom store templates" : null,

  social_store_order_sync: (value: boolean) =>
    value ? "Order syncing for social media stores" : null,

  social_store_service_sync: (value: boolean) =>
    value ? "Service syncing for social media stores" : null,
};

export function formatPlanFeatures(
  features: SubscriptionPlanFeatures
): string[] {
  return (Object.keys(features) as (keyof SubscriptionPlanFeatures)[])
    .map((key) => {
      const formatter = FEATURE_MAP[key];
      return formatter ? formatter(features[key], features) : null;
    })
    .filter((v): v is string => Boolean(v));
}

const FEATURE_LABELS: Record<keyof SubscriptionPlanFeatures, string> = {
  stores: "Stores",
  products: "Products/Services per store",
  unlimited_products: "Unlimited products/services",
  available_templates: "Available templates",
  payment_gateways: "Payment gateways",
  staff_accounts: "Staff accounts",
  analytics: "Analytics",
  api_access: "API access",
  ai_features: "AI features",
  priority_support: "Priority support",
  store_email_notifications: "Store email notifications",
  store_custom_emails: "Store custom emails",
  store_newsletters: "Store newsletters",
  free_ssl: "Free SSL",
  custom_domain: "Custom domain",
  custom_branding: "Custom branding",
  hide_platform_banner: "Hide platform banner",
  custom_templates: "Custom templates",
  social_store_order_sync: "Social store order sync",
  social_store_service_sync: "Social store service sync",
};

export function getFeatureLabel(key: keyof SubscriptionPlanFeatures): string {
  return FEATURE_LABELS[key] ?? (key as string);
}
