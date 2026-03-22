import type { FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { StepCardProps } from "../../../types/Home.types";

const StepCard: FC<StepCardProps> = ({
  step,
  index,
  cont,
  numb,
  isActive,
  onClick,
}) => {
  const activeStyle =
    "bg-[var(--primary)] md:w-[360px] md:pt-6 md:px-10 max-md:min-h-[279px]";
  const inactiveStyle =
    "bg-black md:pt-20 max-md:min-h-[78px]";

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.04 }}
      animate={{
        scale: isActive ? 1.05 : 1,
        boxShadow: isActive
          ? "0 10px 25px rgba(0,0,0,0.25)"
          : "0 0px 0px rgba(0,0,0,0)"
      }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      className={`
        rounded-[4px] px-4 py-6 md:px-0 text-white text-sm font-semibold 
        md:min-h-[400px]
        ${isActive ? activeStyle : inactiveStyle}
        flex justify-center items-center md:items-start md:w-[120px]
        cursor-pointer select-none
      `}
    >
      <motion.div
        layout
        className={`
          w-full flex 
          ${
            isActive
              ? "flex-col gap-3"
              : `items-center justify-center ${cont ?? ""}`
          }
        `}
      >
        {/* Step Number */}
        <motion.div
          layout
          animate={{ rotate: isActive ? 0 : 90 }}
          transition={{ duration: 0.4 }}
          className={`
            font-bold
            ${
              isActive
                ? "text-[40px] md:text-[66px]"
                : `${numb ?? ""} text-[20px] md:text-[24px]`
            }
          `}
        >
          {`0${index + 1}.`}
        </motion.div>

        {/* Title */}
        <motion.div
          layout
          className={`
            capitalize font-bold
            ${
              isActive
                ? "text-[20px] md:text-[30px] text-left"
                : "text-[18px] md:text-[22px] whitespace-nowrap text-center w-full"
            }
          `}
        >
          {step.title}
        </motion.div>

        {/* Description (Only Active) */}
        <AnimatePresence>
          {isActive && (
            <motion.p
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="text-sm md:text-[20px] text-[#ffffffb2] text-left leading-snug pr-2"
            >
              {step.desc}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default StepCard;
