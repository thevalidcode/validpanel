export interface SubscriptionPlan {
  id: number;
  uid: string;
  name: string;
  price: string; // Decimal as string
  currency: string;
  description: string | null;
  status: "ACTIVE" | "INACTIVE";
  features: {
    launch_stores?: string;
    upload_products?: string;
    custom_branding?: boolean;
    priority_support?: boolean;
    store_analytics?: boolean;
    unlimited_products?: boolean;
    onboarding_tools?: boolean;
    [key: string]: any;
  };
  interval: "MONTHLY" | "YEARLY";
  discountForAnnually: number;
  tax: number;
  createdAt: Date;
  updatedAt: Date;
}
