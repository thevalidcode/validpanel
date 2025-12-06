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
    <div className="flex flex-col justify-center items-center mb-12 relative">
      {/* Banner with Arrow */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative mb-6"
      >
        {/* Purple Banner */}
        <div className="relative inline-block">
          {/* Left triangle */}
          <div className="absolute left-0 top-0 bottom-0 w-0 h-0 border-t-[20px] border-t-transparent border-r-[15px] border-r-purple-700 border-b-[20px] border-b-transparent -translate-x-full"></div>

          {/* Main banner */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold text-xs tracking-wider px-8 py-2.5 shadow-lg uppercase">
            Get upto 30% off
          </div>

          {/* Right triangle pointer */}
          <div className="absolute right-0 top-0 bottom-0 w-0 h-0 border-t-[20px] border-t-purple-700 border-r-[15px] border-r-transparent border-b-[20px] border-b-purple-600 translate-x-full"></div>
        </div>

        {/* Curved Arrow pointing to toggle */}
        <motion.svg
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeInOut" }}
          className="absolute -right-16 top-8 w-24 h-24"
          viewBox="0 0 100 100"
          fill="none"
        >
          {/* Curved arrow path */}
          <motion.path
            d="M 10 10 Q 50 30, 70 70"
            stroke="#9333ea"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="5,5"
          />
          {/* Arrow head */}
          <motion.path
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            d="M 65 75 L 70 70 L 75 75"
            stroke="#9333ea"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </motion.svg>
      </motion.div>

      {/* Toggle Switch */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative flex bg-gradient-to-r from-purple-600 to-purple-700 rounded-full p-1.5 w-72 shadow-xl"
      >
        {/* Sliding background indicator */}
        <motion.div
          className="absolute top-1.5 bottom-1.5 bg-white rounded-full shadow-lg"
          initial={false}
          animate={{
            left: isAnnual ? "50%" : "0.375rem",
            right: isAnnual ? "0.375rem" : "50%",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />

        {/* Monthly Button */}
        <button
          onClick={() => setIsAnnual(false)}
          className={`relative z-10 w-1/2 py-3 px-4 rounded-full text-sm font-bold transition-all duration-300 ${
            !isAnnual ? "text-purple-700" : "text-white"
          }`}
        >
          Monthly
        </button>

        {/* Annually Button */}
        <button
          onClick={() => setIsAnnual(true)}
          className={`relative z-10 w-1/2 py-3 px-4 rounded-full text-sm font-bold transition-all duration-300 ${
            isAnnual ? "text-purple-700" : "text-white"
          }`}
        >
          Annually
        </button>
      </motion.div>
    </div>
  );
}
