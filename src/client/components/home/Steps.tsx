import { useState } from "react";
import type { FC } from "react";
import StepCard from "./StepCard";
import type { StepItem } from "../../../types/Home.types";
import Spiral from "../../../assets/images/spiral-icon.svg";
import Star from "../../../assets/images/star-icon.svg";

const Steps: FC = () => {
  const steps: StepItem[] = [
    {
      title: "Select Store Model",
      desc: "Choose between a Classic Online Shop for products or a Social Media Store for digital services.",
    },
    {
      title: "Pick Your Plan",
      desc: "Choose a flexible plan that grows with your business.",
    },
    {
      title: "Claim Your Identity",
      desc: "Set your store name and custom domain link.",
    },
    {
      title: "Customize & Brand",
      desc: "Upload logos and set colors to match your unique style.",
    },
    {
      title: "Configure Payments",
      desc: "Set up how you want to get paid by your customers.",
    },
    {
      title: "Go Live",
      desc: "Review settings and launch your store to the world.",
    },
  ];

  const [activeStep, setActiveStep] = useState<number>(1);

  return (
    <section className="px-[16px] md:px-[150px] md:pb-40 pb-20 bg-white text-center inter pt-10">
      <h2 className="text-[32px] md:text-[48px] font-bold mb-10 relative">
        Get Started in <span className="text-[var(--primary)]">6 Simple</span>{" "}
        Steps
        <img
          src={Star}
          alt="star icon"
          className="absolute bottom-[-20px] right-[50px] md:right-[100px]"
        />
      </h2>

      <div className="grid gap-4 md:flex md:justify-center md:items-center">
        <img src={Spiral} alt="spiral icon" className="max-md:hidden pr-5" />

        {steps.map((step, index) => (
          <StepCard
            key={index}
            step={step}
            index={index}
            cont="md:rotate-90"
            numb="md:-rotate-90"
            isActive={activeStep === index}
            onClick={() => setActiveStep(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default Steps;
