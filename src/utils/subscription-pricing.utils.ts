import Decimal from "decimal.js";
import type { CurrencyCode } from "@/lib/currencyConverter";
import type { BillingInterval, DiscountType } from "@/types/models/coupon";
import type {
  PlanPrice,
  SubscriptionPlan,
} from "@/types/models/subscription-plan";
import { toast } from "sonner";

export interface ResolvedPlanPrice {
  price: PlanPrice | null;
  amount: Decimal;
  currency: CurrencyCode;
  taxRate: Decimal;
}

export interface CouponPricingInput {
  type: DiscountType;
  value: string;
  currency?: CurrencyCode | null;
}

export interface PricingComputationInput {
  subtotal: string;
  taxRate: string | number | Decimal;
  couponApplied?: boolean;
  couponDiscountAmount?: string;
  couponCurrency?: CurrencyCode;
  subtotalCurrency: CurrencyCode;
  coupon?: CouponPricingInput;
  convertAmount?: (
    source: CurrencyCode,
    target: CurrencyCode,
    amount: string,
  ) => string;
}

export interface PricingComputationResult {
  subtotalBeforeDiscount: string;
  couponDiscount: string;
  subtotalAfterDiscount: string;
  taxAmount: string;
  total: string;
}

export function resolvePlanPrice(
  plan: SubscriptionPlan,
  interval: BillingInterval,
  preferredCurrency?: CurrencyCode,
): ResolvedPlanPrice {
  const targetCurrency = preferredCurrency || "USD";

  const directPrice = plan.prices?.find(
    (p) => p.interval === interval && p.currency === targetCurrency,
  );

  const fallbackPrice =
    plan.prices?.find((p) => p.interval === interval && p.isDefault) ||
    plan.prices?.find((p) => p.interval === interval);

  const selectedPrice = directPrice || fallbackPrice || null;
  const amount = new Decimal(selectedPrice?.price || 0);
  const currency = (selectedPrice?.currency || "USD") as CurrencyCode;
  const taxRate = new Decimal(selectedPrice?.tax || 0);

  return {
    price: selectedPrice,
    amount,
    currency,
    taxRate,
  };
}

export function computeCouponDiscountAmount(
  subtotal: string,
  subtotalCurrency: CurrencyCode,
  coupon?: CouponPricingInput,
  couponApplied?: boolean,
  couponDiscountAmount?: string,
  couponCurrency?: CurrencyCode,
  convertAmount?: (
    source: CurrencyCode,
    target: CurrencyCode,
    amount: string,
  ) => string,
): Decimal {
  const subtotalDecimal = new Decimal(subtotal || 0);

  if (!couponApplied || subtotalDecimal.lte(0)) {
    return new Decimal(0);
  }

  if (couponDiscountAmount) {
    let normalized = new Decimal(couponDiscountAmount);
    const fromCurrency = couponCurrency;

    if (fromCurrency && fromCurrency !== subtotalCurrency && convertAmount) {
      normalized = new Decimal(
        convertAmount(fromCurrency, subtotalCurrency, normalized.toFixed(2)),
      );
    }

    return Decimal.min(subtotalDecimal, Decimal.max(normalized, 0));
  }

  if (!coupon) {
    return new Decimal(0);
  }

  if (coupon.type === "PERCENTAGE") {
    const percent = new Decimal(coupon.value || 0);
    const discount = subtotalDecimal.mul(percent.div(100));
    return Decimal.min(subtotalDecimal, Decimal.max(discount, 0));
  }

  if (coupon.type === "FIXED" && coupon.currency !== subtotalCurrency) {
    toast.error("Coupon currency must match plan currency", {
      id: "coupon-currency-mismatch",
    });
    return new Decimal(0);
  }

  let fixedValue = new Decimal(coupon.value || 0);
  const fixedCurrency = coupon.currency as CurrencyCode | undefined;

  if (fixedCurrency && fixedCurrency !== subtotalCurrency && !convertAmount) {
    throw new Error("Currency conversion required but not provided");
  }

  if (fixedCurrency && fixedCurrency !== subtotalCurrency && convertAmount) {
    fixedValue = new Decimal(
      convertAmount(fixedCurrency, subtotalCurrency, fixedValue.toFixed(2)),
    );
  }

  return Decimal.min(subtotalDecimal, Decimal.max(fixedValue, 0));
}

export function computePricingBreakdown({
  subtotal,
  taxRate,
  couponApplied,
  couponDiscountAmount,
  couponCurrency,
  subtotalCurrency,
  coupon,
  convertAmount,
}: PricingComputationInput): PricingComputationResult {
  const subtotalBeforeDiscount = new Decimal(subtotal || 0);

  const couponDiscount = computeCouponDiscountAmount(
    subtotalBeforeDiscount.toFixed(2),
    subtotalCurrency,
    coupon,
    couponApplied,
    couponDiscountAmount,
    couponCurrency,
    convertAmount,
  );

  const subtotalAfterDiscount = Decimal.max(
    new Decimal(0),
    subtotalBeforeDiscount.minus(couponDiscount),
  );

  const taxRateDecimal = new Decimal(taxRate || 0);
  const taxAmount = subtotalAfterDiscount.mul(taxRateDecimal.div(100));
  const total = subtotalAfterDiscount.plus(taxAmount);

  return {
    subtotalBeforeDiscount: subtotalBeforeDiscount.toFixed(2),
    couponDiscount: couponDiscount.toFixed(2),
    subtotalAfterDiscount: subtotalAfterDiscount.toFixed(2),
    taxAmount: taxAmount.toFixed(2),
    total: total.toFixed(2),
  };
}

export function computeAnnualSavingsPercent(
  plan: SubscriptionPlan,
  currency?: CurrencyCode,
): number {
  const preferredCurrency = currency || "USD";

  const monthly = resolvePlanPrice(plan, "MONTHLY", preferredCurrency);
  const yearly = resolvePlanPrice(plan, "YEARLY", preferredCurrency);

  if (monthly.amount.lte(0) || yearly.amount.lte(0)) {
    return 0;
  }

  const annualCostIfMonthly = monthly.amount.mul(12);
  const annualCostActual = yearly.amount;

  if (!annualCostIfMonthly.gt(annualCostActual)) {
    return 0;
  }

  return annualCostIfMonthly
    .minus(annualCostActual)
    .div(annualCostIfMonthly)
    .mul(100)
    .round()
    .toNumber();
}

export function computeUpgradeDueToday(
  currentPlan: SubscriptionPlan | null | undefined,
  nextPlan: SubscriptionPlan,
  interval: BillingInterval,
  preferredCurrency?: CurrencyCode,
): string {
  const next = resolvePlanPrice(nextPlan, interval, preferredCurrency).amount;

  if (!currentPlan) {
    return next.toFixed(2);
  }

  const current = resolvePlanPrice(
    currentPlan,
    interval,
    preferredCurrency,
  ).amount;
  if (next.lte(current)) {
    return "0.00";
  }

  return next.minus(current).toFixed(2);
}
