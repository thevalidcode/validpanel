import { type FC, useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import type { FaqQuestionAnswerProps } from "../../../types/Faq.types";

const FaqQuestionAnswercomp: FC<FaqQuestionAnswerProps> = ({ question }) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div
      className="bg-gradient-to-r from-purple-100 to-white p-4 mb-3 border rounded-t-lg cursor-pointer"
      onClick={() => setOpen(!open)}
    >
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-sm md:text-base">{question.q}</h3>
        <span>{open ? <FaMinus /> : <FaPlus />}</span>
      </div>
      {open && <p className="mt-2 text-sm text-gray-700">{question.a}</p>}
    </div>
  );
};

export default FaqQuestionAnswercomp;