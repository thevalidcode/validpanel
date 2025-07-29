import { type FC } from "react";
import type { StepCardProps } from "../../../types/Home.types";

const StepCard: FC<StepCardProps> = ({ step, cont, numb, index }) => (
  <div
    className={`rounded-xl px-4 py-6 text-white text-sm font-semibold ${
      index === 1 ? "bg-purple-700 md:w-[300px]" : "bg-black"
    } flex justify-center items-center min-h-[100px] md:min-h-[220px]`}
  >
    <div
      className={`${
        index === 1 ? "grid justify-items-start" : `flex justify-center items-center ${cont ?? ""}`
      } gap-2`}
    >
      <div
        className={`text-lg md:text-xl font-bolder mb-2 ${index === 1 ? "" : `${numb ?? ""}`}`}
      >
        {`0${index + 1}.`}
      </div>
      <div className="capitalize font-bold">{step.title}</div>
      <p className="text-sm leading-snug text-gray-400">{step.desc}</p>
    </div>
  </div>
);

export default StepCard;