import { type FC } from "react";
import FaqQuestionAnswercomp from "./FaqQuestionAnswercomp";
import type { FaqCategoryProps } from "../../../types/Faq.types";

const FaqCategory: FC<FaqCategoryProps> = ({ title, questions }) => (
  <div className="my-5">
    <h2 className="text-xl font-bold mb-4">
      {title.replace(/\s(\w+)$/, " ")}
      <span className="text-purple-600">{title.split(" ").slice(-1)}</span>
    </h2>
    <div className="w-full flex flex-col justify-center">
      {questions.map((question, index) => (
        <FaqQuestionAnswercomp key={index} question={question} />
      ))}
    </div>
  </div>
);

export default FaqCategory;