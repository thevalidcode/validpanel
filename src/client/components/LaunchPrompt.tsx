import { motion } from "framer-motion";
import type { FC } from "react";
import { Link } from "react-router-dom";
import { FaRocket } from "react-icons/fa";

const LaunchPrompt: FC = () => {
  return (
    <section className="py-20 px-4 mb-20">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-[var(--color-primary)] rounded-xl p-8 md:p-16 text-center text-white shadow-2xl shadow-purple-500/30 relative overflow-hidden"
        >
          {/* Decorative circles */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

          <h2 className="text-3xl md:text-5xl font-bold mb-6 relative z-10">
            Ready to Build Your Empire?
          </h2>
          <p className="text-lg md:text-xl text-purple-100 max-w-2xl mx-auto mb-10 relative z-10">
            Join thousands of entrepreneurs building their future with
            ValidPanel. Start today for free.
          </p>

          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-white text-[var(--color-primary)] px-8 py-4 rounded-[4px] font-bold text-lg hover:bg-gray-100 transition-colors relative z-10 shadow-lg hover:shadow-xl hover:-translate-y-1 transform duration-200"
          >
            <FaRocket /> Launch Now
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default LaunchPrompt;
