import { motion } from "framer-motion";
import type { FC } from "react";

const flowSteps = [
  { id: 1, label: "Register", x: 10, y: 50 },
  { id: 2, label: "Create Store", x: 35, y: 20 },
  { id: 3, label: "Add Products", x: 65, y: 20 },
  { id: 4, label: "Setup Payments", x: 90, y: 50 },
  { id: 5, label: "Scale", x: 50, y: 90 },
];

const HowItWorksFlow: FC = () => {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 text-center mb-16">
        <h2 className="text-3xl font-bold mb-4">How ValidPanel Works</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          A purely connected ecosystem designed to take you from zero to global
          sales.
        </p>
      </div>

      <div className="relative w-full max-w-4xl mx-auto aspect-[16/9] md:aspect-[21/9]">
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* Animated Paths */}
          <motion.path
            d="M10,50 L35,20 L65,20 L90,50 L50,90 Z"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="0.5"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--color-primary)" />
              <stop offset="100%" stopColor="var(--color-secondary)" />
            </linearGradient>
          </defs>
        </svg>

        {/* Nodes */}
        {flowSteps.map((step, i) => (
          <motion.div
            key={step.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
            style={{ left: `${step.x}%`, top: `${step.y}%` }}
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.3, type: "spring" }}
          >
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white shadow-lg border-2 border-purple-100 flex items-center justify-center text-lg md:text-2xl font-bold text-gray-800 z-10 relative">
              {i + 1}
              <div className="absolute inset-0 rounded-full bg-purple-500/10 animate-ping opacity-20" />
            </div>
            <span className="mt-3 text-sm md:text-base font-medium text-gray-700 bg-white/80 px-2 py-1 rounded backdrop-blur-sm">
              {step.label}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorksFlow;
