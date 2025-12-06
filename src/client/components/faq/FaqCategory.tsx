import { useState } from "react";
import FaqQuestionAnswer from "./FaqQuestionAnswer";
import type { FaqQuestionAnswerProps } from "../../../types/Faq.types";
import { motion } from "framer-motion";

const FaqCategory = ({
  title,
  questions,
  index,
}: {
  title: string;
  questions: FaqQuestionAnswerProps["question"][];
  index: number;
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="mb-8"
    >
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        {title.split(" ")[0]}{" "}
        <span>
          {title
            .split(" ")
            .slice(1) // skip the first word
            .map((word, i) => (
              <span key={i} className="text-purple-600">
                {word}{" "}
              </span>
            ))}
        </span>
      </h2>
      <div className="flex flex-col">
        {questions.map((question, idx) => (
          <FaqQuestionAnswer
            key={idx}
            question={question}
            isOpen={openIndex === idx}
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default FaqCategory;
