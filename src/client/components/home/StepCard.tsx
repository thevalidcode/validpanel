import { type FC } from "react";
import type { StepCardProps } from "../../../types/Home.types";

const StepCard: FC<StepCardProps> = ({ step, cont, numb, index }) => (
  <div
    className={`rounded-xl px-4 py-6 md:px-0 text-white text-sm font-semibold md:min-h-[400px] ${
      index === 1 ? "bg-[var(--primary)] md:w-[360px] md:pt-6 md:px-10 max-md:min-h-[279px]" : "bg-black md:pt-20 max-md:min-h-[78px]"
    } flex justify-center items-center md:items-start md:w-[120px]`}
  >
    <div
      className={`${
        index === 1 ? "grid justify-items-start" : `flex w-full h-full items-center justify-center ${cont ?? ""}`
      } gap-2`}
    >
      <div
        className={`text-lg md:text-xl font-bolder md:mb-2 ${index === 1 ? "md:text-[66.86px]" : `${numb ?? ""} md:text-[24.25px]`}`}
      >
        {`0${index + 1}.`}
      </div>
      <div className={`${index!==1 ? 'md:h-full md:text-[24.25px] md:w-full whitespace-nowrap':'md:text-[29.63px] md:text-left'} capitalize font-bold`}>{step.title}</div>
      <p className={index=== 1 ? `text-sm leading-snug text-left text-[#FFFFFFB2] md:text-[20px]`: `hidden`}>{step.desc}</p>
    </div>
  </div>
);

export default StepCard;