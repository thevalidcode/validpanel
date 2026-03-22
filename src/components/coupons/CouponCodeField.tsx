import { TicketPercent, CheckCircle2 } from "lucide-react";

interface CouponCodeFieldProps {
  value: string;
  onChange: (value: string) => void;
  onApply: () => void;
  isApplying?: boolean;
  applied?: boolean;
  message?: string;
  disabled?: boolean;
  className?: string;
}

export default function CouponCodeField({
  value,
  onChange,
  onApply,
  isApplying = false,
  applied = false,
  message,
  disabled = false,
  className,
}: CouponCodeFieldProps) {
  return (
    <div className={`rounded-[4px] border border-gray-200 bg-white p-4 ${className || ""}`.trim()}>
      <div className="flex items-center gap-2 mb-2">
        <TicketPercent className="w-4 h-4 text-primary" />
        <p className="text-sm font-semibold text-gray-900">Have a coupon?</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          placeholder="Enter coupon code"
          disabled={disabled || isApplying}
          className="h-10 flex-1 rounded-[4px] border border-gray-300 px-3 text-sm outline-none focus:border-primary disabled:bg-gray-100 disabled:text-gray-500"
        />
        <button
          type="button"
          onClick={onApply}
          disabled={disabled || isApplying || !value.trim()}
          className="h-10 px-4 rounded-[4px] text-sm font-medium bg-primary text-white hover:bg-primary/90 disabled:opacity-60"
        >
          {isApplying ? "Validating..." : applied ? "Re-apply" : "Apply"}
        </button>
      </div>

      {message && (
        <p className={`mt-2 text-xs ${applied ? "text-emerald-700" : "text-gray-500"}`}>
          {applied && <CheckCircle2 className="inline mr-1 w-3.5 h-3.5" />}
          {message}
        </p>
      )}
    </div>
  );
}
