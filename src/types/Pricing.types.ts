export interface Plan {
  name: string;
  monthly: number;
  annually: number;
  idealFor: string;
  features: string[];
  buttonText: string;
  link: string;
}

export interface PricingCardProps {
  isAnnual: boolean;
}

export interface PricingPlanCardProps {
  plan: Plan;
  isAnnual: boolean;
}

export interface ComparisonTableRow {
  category: string;
  free: string;
  standard: string;
  pro: string;
}

export interface PricingToggleProps {
  isAnnual: boolean;
  setIsAnnual: (value: boolean) => void;
}