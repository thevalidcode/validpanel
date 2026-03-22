import { motion } from "framer-motion";

export default function PricingHero() {
  return (
    <section className="relative pt-23 pb-12 md:pt-32 md:pb-16 text-center bg-white">
      <div className="relative z-10 max-w-3xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6 leading-[1.1]">
            Plans for every stage of your{" "}
            <span className="text-[var(--color-primary)]">growth</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Simple, transparent pricing. No hidden fees. Start for free and
            upgrade as you grow.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
