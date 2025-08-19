import { type FC } from "react";
import StepCard from "./StepCard";
import type { StepItem } from "../../../types/Home.types";
import Spiral from "../../../assets/images/spiral-icon.svg"
import Star from "../../../assets/images/star-icon.svg"

const Steps: FC = () => {
  const steps: StepItem[] = [
    { title: "Choose Store Type", desc: "" },
    { title: "Name Your Store", desc: "Pick a unique name and customize your store link(subdomain)." },
    { title: "Add Branding", desc: "" },
    { title: "Setup Payment", desc: "" },
    { title: "Launch", desc: "" },
  ];

  return (
    <section className="px-[16px] md:px-[150px] md:pb-40 pb-20 bg-white text-center inter">
      <h2 className="text-[32px] md:text-[48px] font-bold mb-10 relative">
        Get Started in <span className="text-[var(--primary)]">5 Simple</span> Steps
        <img src={Star} alt="star icon" className="absolute bottom-[-20px] right-[50px] md:right-[100px]"/>
      </h2>
      <div className="grid gap-4 md:flex md:justify-center md:items-center text-none">
          <img src={Spiral} alt="spiral icon" className="max-md:hidden pr-5"/>
        {steps.map((step, index) => (
          <StepCard
            key={index}
            step={step}
            index={index}
            cont="md:rotate-90"
            numb="md:-rotate-90"
          />
        ))}
      </div>
    </section>
  );
};

export default Steps;