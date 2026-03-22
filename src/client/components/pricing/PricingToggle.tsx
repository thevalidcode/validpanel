import { motion } from "framer-motion";

interface PricingToggleProps {
  isAnnual: boolean;
  setIsAnnual: (value: boolean) => void;
}

export default function PricingToggle({
  isAnnual,
  setIsAnnual,
}: PricingToggleProps) {
  return (
    <div className="flex justify-center items-center py-8 flex-wrap gap-4">
      <div className="bg-gray-100 p-1 rounded-[4px] inline-flex relative">
        <div className="absolute inset-0 pointer-events-none p-1">
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="w-1/2 h-full bg-white rounded-[3px] shadow-sm border border-gray-200/50"
            animate={{
              x: isAnnual ? "100%" : "0%",
            }}
          />
        </div>

        <button
          onClick={() => setIsAnnual(false)}
          className={`relative z-10 px-8 py-2 text-sm font-medium transition-colors duration-200 w-32 ${
            !isAnnual ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setIsAnnual(true)}
          className={`relative z-10 px-8 py-2 text-sm font-medium transition-colors duration-200 w-32 flex items-center justify-center gap-2 ${
            isAnnual ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Yearly
        </button>
      </div>
      <span className="text-xs font-semibold text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-2 py-1 rounded-[4px]">
        Save up to 20%
      </span>
    </div>
  );
}
