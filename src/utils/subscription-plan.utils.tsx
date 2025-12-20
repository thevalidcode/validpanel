import type { SubscriptionPlanFeatures } from "@/types";

type FeatureFormatter = (
  value: any,
  features: SubscriptionPlanFeatures
) => string | null;

const FEATURE_MAP: Record<keyof SubscriptionPlanFeatures, FeatureFormatter> = {
  stores: (value) => `Launch up to ${value} stores`,

  products: (value) =>
    value === null ? null : `Upload up to ${value} products per store`,

  unlimited_products: (value) =>
    value ? "Unlimited products per store" : null,

  available_templates: (value) =>
    `Access ${value} professionally designed templates`,

  payment_gateways: (value) => `Use up to ${value} payment gateways`,

  staff_accounts: (value) =>
    value > 0 ? `Add up to ${value} staff accounts` : null,

  analytics: (value) => (value ? "Basic analytics dashboard" : null),

  store_analytics: (value) => (value ? "Advanced store analytics" : null),

  api_access: (value) => (value ? "API access for integrations" : null),

  ai_features: (value) => (value ? "AI-powered automation features" : null),

  priority_support: (value) => (value ? "Priority customer support" : null),

  customer_emails: (value) =>
    value ? "Automated customer email notifications" : null,

  free_ssl: (value) => (value ? "Free SSL security on all stores" : null),

  custom_domain: (value) => (value ? "Connect a custom domain" : null),

  custom_branding: (value) => (value ? "Custom branding" : null),

  hide_banner: (value) => (value ? "Hide platform promotional banners" : null),

  default_template: (value) =>
    value ? "Default starter template included" : null,

  custom_templates: (value) => (value ? "Upload custom store templates" : null),

  order_syncing_for_social_media_store: (value) =>
    value ? "Order syncing for social media stores" : null,
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
