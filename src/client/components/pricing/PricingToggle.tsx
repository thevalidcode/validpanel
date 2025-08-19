import type { PricingToggleProps } from "../../../types/Pricing.types";

export default function PricingToggle({ isAnnual, setIsAnnual }: PricingToggleProps) {
  return (
    <div className="flex flex-col justify-end items-center space-y-4">
      {/* Discount Banner */}
      <div className="hidden relative">
        <div className="bg-purple-700 text-white font-semibold text-sm px-4 py-2 rounded-full">
          GET UPTO 30% OFF
        </div>
        <div className="absolute -bottom-4 right-0 text-purple-700 text-xl transform rotate-45">
          ↗
        </div>
      </div>

      {/* Toggle Switch */}
      <div className="flex bg-purple-700 rounded-full p-1 relative w-60 justify-between">
        <button
          onClick={() => setIsAnnual(false)}
          className={`w-1/2 py-2 rounded-full text-sm font-medium transition duration-300 ${
            !isAnnual ? "bg-white text-purple-700" : "text-white"
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setIsAnnual(true)}
          className={`w-1/2 py-2 rounded-full text-sm font-medium transition duration-300 ${
            isAnnual ? "bg-white text-purple-700" : "text-white"
          }`}
        >
          Annually
        </button>
      </div>
    </div>
  );
}