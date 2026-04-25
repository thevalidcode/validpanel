import { type ReactNode, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";
import {
  BadgePercent,
  TicketPercent,
  X,
  ArrowUpRight,
  PanelRightClose,
} from "lucide-react";
import { useGetCouponsByContext } from "@/hooks/use-coupon";
import type { Coupon } from "@/types";
import type { CouponAppliesTo } from "@/types/models/coupon";

type CouponShowcaseVariant =
  | "banner"
  | "cards"
  | "compact"
  | "sidebar"
  | "dialog"
  | "spotlight";

interface CouponShowcaseProps {
  context: string;
  variant?: CouponShowcaseVariant;
  title?: string;
  className?: string;
  appliesTo?: CouponAppliesTo;
  selectedCode?: string;
  maxItems?: number;
  onUseCoupon?: (coupon: Coupon) => void;
  onRemoveCoupon?: (coupon: Coupon) => void;
  isApplying?: boolean;
  autoOpenDelayMs?: number;
  autoOpenStorageKey?: string;
  signupPath?: string;
}

function formatCouponValue(coupon: Coupon): string {
  if (coupon.type === "PERCENTAGE") {
    return `${coupon.value}% OFF`;
  }
  return `${coupon.currency || "USD"} ${coupon.value} OFF`;
}

export default function CouponShowcase({
  context,
  variant = "banner",
  title = "Active Offers",
  className,
  appliesTo,
  selectedCode,
  maxItems,
  onUseCoupon,
  onRemoveCoupon,
  isApplying,
  autoOpenDelayMs,
  autoOpenStorageKey,
  signupPath = "/onboarding",
}: CouponShowcaseProps) {
  const { data: coupons, isLoading } = useGetCouponsByContext(context);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const hasAutoOpenedRef = useRef(false);

  const renderPortal = (content: ReactNode) => {
    if (typeof document === "undefined") return null;
    return createPortal(content, document.body);
  };

  const getSeenStorageKey = () =>
    autoOpenStorageKey || `coupon_showcase_seen_${context}_${variant}`;

  const markPopupSeen = () => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(getSeenStorageKey(), "1");
  };

  const isPopupAlreadySeen = () => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(getSeenStorageKey()) === "1";
  };

  useEffect(() => {
    if (!autoOpenDelayMs || autoOpenDelayMs < 0 || hasAutoOpenedRef.current) {
      return;
    }

    if (isPopupAlreadySeen()) {
      hasAutoOpenedRef.current = true;
      return;
    }

    const timer = window.setTimeout(() => {
      if (variant === "sidebar") {
        setIsDrawerOpen(true);
      } else {
        setIsDialogOpen(true);
      }
      hasAutoOpenedRef.current = true;
      markPopupSeen();
    }, autoOpenDelayMs);

    return () => window.clearTimeout(timer);
  }, [autoOpenDelayMs, variant]);

  const defaultLimit =
    variant === "compact" ? 1 : variant === "sidebar" ? 4 : 3;
  const limit = maxItems || defaultLimit;

  if (isLoading || !coupons || coupons.length === 0) {
    return null;
  }

  const filteredCoupons = (
    appliesTo
      ? coupons.filter((coupon) => (coupon.appliesTo || []).includes(appliesTo))
      : coupons
  )
    .filter((coupon) => coupon.isActive)
    .sort((a, b) => (b.priority || 0) - (a.priority || 0));

  if (!filteredCoupons.length) {
    return null;
  }
  const topCoupons = filteredCoupons.slice(0, limit);
  const renderUseButton = (coupon: Coupon) => {
    if (!onUseCoupon) return null;
    const isSelected =
      selectedCode?.toLowerCase() === coupon.code.toLowerCase();
    const canRemoveSelected = isSelected && !!onRemoveCoupon;

    return (
      <button
        type="button"
        disabled={isApplying}
        onClick={() => {
          if (canRemoveSelected) {
            onRemoveCoupon(coupon);
            return;
          }
          onUseCoupon(coupon);
        }}
        className={`inline-flex items-center gap-1.5 rounded-[4px] px-2.5 py-1.5 text-xs font-semibold transition ${
          canRemoveSelected
            ? "bg-rose-100 text-rose-700 hover:bg-rose-200"
            : isSelected
              ? "bg-emerald-100 text-emerald-700"
              : "bg-primary/10 text-primary hover:bg-primary/15"
        } ${isApplying ? "opacity-60 cursor-not-allowed" : ""}`}
      >
        {canRemoveSelected ? <X size={14} /> : <BadgePercent size={14} />}
        {canRemoveSelected ? "Remove" : "Use"}
      </button>
    );
  };

  if (variant === "compact") {
    const coupon = topCoupons[0];
    return (
      <div
        className={`rounded-[4px] border border-emerald-200 bg-emerald-50 px-4 py-3 ${className || ""}`.trim()}
      >
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-[4px] bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <TicketPercent size={16} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-emerald-900 truncate">
              {coupon.highlightText ||
                `${formatCouponValue(coupon)} with ${coupon.code}`}
            </p>
            <p className="text-xs text-emerald-700">Use code {coupon.code}</p>
          </div>
          {renderUseButton(coupon)}
        </div>
      </div>
    );
  }

  if (variant === "sidebar") {
    return (
      <section className={className}>
        <div className="rounded-[4px] border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="h-8 w-8 rounded-[4px] bg-primary/10 text-primary flex items-center justify-center">
                <TicketPercent size={16} />
              </span>
              <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
            </div>
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="text-xs text-primary font-semibold hover:underline inline-flex items-center gap-1"
            >
              View all
              <ArrowUpRight size={12} />
            </button>
          </div>

          <div className="space-y-2">
            {topCoupons.map((coupon) => (
              <div
                key={coupon.uid}
                className="rounded-[4px] border border-gray-100 bg-gray-50 p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs text-primary font-semibold uppercase tracking-wide">
                      {formatCouponValue(coupon)}
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                      {coupon.code}
                    </p>
                    <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">
                      {coupon.highlightText ||
                        "Use at checkout to reduce your due today."}
                    </p>
                  </div>
                  {renderUseButton(coupon)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {isDrawerOpen &&
          renderPortal(
            <>
              <motion.div
                className="fixed inset-0 bg-black/40 z-[120]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setIsDrawerOpen(false)}
              />
              <motion.aside
                initial={{ x: 420 }}
                animate={{ x: 0 }}
                transition={{ type: "spring", stiffness: 280, damping: 26 }}
                className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[121] border-l border-gray-200 shadow-2xl"
              >
                <div className="p-5 border-b border-gray-200 flex items-center justify-between">
                  <h4 className="text-base font-semibold text-gray-900">
                    Available Coupons
                  </h4>
                  <button
                    title="close"
                    type="button"
                    onClick={() => setIsDrawerOpen(false)}
                    className="h-8 w-8 rounded-[4px] border border-gray-200 text-gray-500 flex items-center justify-center"
                  >
                    <PanelRightClose size={16} />
                  </button>
                </div>
                <div className="p-5 space-y-3 overflow-y-auto h-[calc(100%-76px)]">
                  {filteredCoupons.map((coupon) => (
                    <div
                      key={coupon.uid}
                      className="rounded-[4px] border border-gray-200 p-4"
                    >
                      <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                        {formatCouponValue(coupon)}
                      </p>
                      <p className="text-base font-bold text-gray-900 mt-1">
                        {coupon.code}
                      </p>
                      <p className="text-xs text-gray-600 mt-1 mb-3">
                        {coupon.highlightText || "Limited time discount offer."}
                      </p>
                      {renderUseButton(coupon)}
                    </div>
                  ))}
                </div>
              </motion.aside>
            </>,
          )}
      </section>
    );
  }

  if (variant === "cards") {
    return (
      <section className={className}>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {topCoupons.map((coupon) => (
            <article
              key={coupon.uid}
              className="rounded-[4px] border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <p className="text-xs text-primary font-semibold uppercase tracking-wide mb-2">
                {formatCouponValue(coupon)}
              </p>
              <p className="text-sm font-bold text-gray-900 mb-1">
                {coupon.code}
              </p>
              <p className="text-xs text-gray-600 line-clamp-2">
                {coupon.highlightText ||
                  "Limited-time offer available at checkout."}
              </p>
              {onUseCoupon && (
                <div className="mt-3">{renderUseButton(coupon)}</div>
              )}
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (variant === "spotlight") {
    const featuredCoupon = topCoupons[0];

    const handleSignup = (withCoupon: boolean) => {
      markPopupSeen();
      const path = withCoupon
        ? `${signupPath}?coupon=${encodeURIComponent(featuredCoupon.code)}`
        : signupPath;
      window.location.href = path;
    };

    return (
      <section className={className}>
        {isDialogOpen &&
          renderPortal(
            <>
              <motion.div
                className="fixed inset-0 bg-black/50 z-[120]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => setIsDialogOpen(false)}
              />
              <motion.div
                className="fixed inset-0 z-[121] flex items-center justify-center p-4"
                initial={{ opacity: 0, y: 18, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="w-full max-w-2xl overflow-hidden rounded-[4px] border border-gray-200 bg-white shadow-2xl">
                  <div className="relative border-b border-gray-200 bg-white px-6 py-5">
                    <button
                      title="close"
                      type="button"
                      onClick={() => setIsDialogOpen(false)}
                      className="absolute top-4 right-4 h-8 w-8 rounded-[4px] border border-gray-200 bg-white text-gray-500 flex items-center justify-center"
                    >
                      <X size={16} />
                    </button>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">
                      Exclusive Welcome Discount
                    </p>
                    <h3 className="mt-2 text-2xl font-bold text-gray-900">
                      Use {featuredCoupon.code} and save{" "}
                      {formatCouponValue(featuredCoupon)}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600 max-w-xl">
                      {featuredCoupon.highlightText ||
                        "Activate your account today and apply this offer at checkout to reduce your first subscription payment."}
                    </p>
                  </div>

                  <div className="px-6 py-5 bg-gray-50/70">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.06,
                        duration: 0.35,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="rounded-[4px] border border-gray-200 bg-white p-4 flex items-start justify-between gap-4"
                    >
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Recommended Coupon
                        </p>
                        <p className="text-lg font-bold text-gray-900 mt-1">
                          {featuredCoupon.code}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          Applies automatically on signup checkout when you
                          continue.
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-gray-900 whitespace-nowrap">
                        {formatCouponValue(featuredCoupon)}
                      </span>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.12,
                        duration: 0.35,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="mt-5 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          markPopupSeen();
                          setIsDialogOpen(false);
                        }}
                        className="rounded-[4px] border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                      >
                        Maybe later
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSignup(false)}
                        className="rounded-[4px] border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50"
                      >
                        Create account
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSignup(true)}
                        className="rounded-[4px] bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90"
                      >
                        Sign up and use coupon
                      </button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </>,
          )}
      </section>
    );
  }

  return (
    <section className={className}>
      <div className="rounded-[4px] border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-[4px] bg-primary/10 text-primary flex items-center justify-center">
              <TicketPercent size={18} />
            </div>
            <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          </div>
          <button
            type="button"
            onClick={() => setIsDialogOpen(true)}
            className="text-xs text-primary font-semibold hover:underline"
          >
            See all
          </button>
        </div>

        <div className="space-y-2">
          {topCoupons.map((coupon) => (
            <div
              key={coupon.uid}
              className="flex items-center justify-between rounded-[4px] border border-gray-100 bg-gray-50 px-3 py-2"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {coupon.code}
                </p>
                <p className="text-xs text-gray-600 truncate">
                  {coupon.highlightText || formatCouponValue(coupon)}
                </p>
              </div>
              <span className="text-xs font-semibold text-primary ml-3 whitespace-nowrap">
                {formatCouponValue(coupon)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {isDialogOpen &&
        renderPortal(
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-[120]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setIsDialogOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="fixed inset-0 z-[121] flex items-center justify-center p-4"
            >
              <div className="w-full max-w-xl rounded-[4px] border border-gray-200 bg-white shadow-2xl">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h4 className="text-base font-semibold text-gray-900">
                    All Available Offers
                  </h4>
                  <button
                    title="close"
                    type="button"
                    onClick={() => setIsDialogOpen(false)}
                    className="h-8 w-8 rounded-[4px] border border-gray-200 text-gray-500 flex items-center justify-center"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
                  {filteredCoupons.map((coupon) => (
                    <div
                      key={coupon.uid}
                      className="rounded-[4px] border border-gray-200 bg-gray-50 p-3 flex items-start justify-between gap-3"
                    >
                      <div>
                        <p className="text-xs text-primary font-semibold uppercase">
                          {formatCouponValue(coupon)}
                        </p>
                        <p className="text-sm font-bold text-gray-900">
                          {coupon.code}
                        </p>
                        <p className="text-xs text-gray-600 mt-0.5">
                          {coupon.highlightText ||
                            "Offer can be used during subscription checkout."}
                        </p>
                      </div>
                      {renderUseButton(coupon)}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>,
        )}
    </section>
  );
}
