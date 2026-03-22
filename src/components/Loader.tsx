import React from "react";
import { motion } from "framer-motion";

const Loader: React.FC = () => {
  const bounceTransition = {
    y: {
      repeat: Infinity,
      repeatType: "mirror" as const, // replaces yoyo
      duration: 0.6,
      ease: "easeInOut" as const,
    },
  };

  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="flex space-x-3">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="w-4 h-4 rounded-[2px] bg-[#7D1EFE]"
            animate={{ y: [0, -15, 0] }}
            transition={{ ...bounceTransition, delay: i * 0.2 }}
          />
        ))}
      </div>
    </div>
  );
};

export default Loader;
