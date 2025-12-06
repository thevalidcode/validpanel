import { type FC, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { FaqQuestionAnswerProps } from "../../../types/Faq.types";

const FaqQuestionAnswer: FC<FaqQuestionAnswerProps> = ({
  question,
  isOpen,
  onClick,
}) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-r from-purple-100 to-white p-4 rounded-t-lg cursor-pointer border border-gray-200 rounded-lg mb-3 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
      onClick={() => setOpen(!open)}
    >
      <button
        type="button"
        onClick={onClick}
        className="w-full p-2 flex justify-between items-center text-left cursor-pointer hover:bg-gray-50 transition-colors"
      >
        <h3 className="font-semibold text-sm md:text-base text-gray-800 pr-4">
          {question.q}
        </h3>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className="text-purple-600"
          >
            <path
              d="M10 5V15M5 10H15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0">
              <p className="text-sm text-gray-600 leading-relaxed">
                {question.a}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FaqQuestionAnswer;
