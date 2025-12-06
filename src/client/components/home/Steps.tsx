import { useState } from "react";
import type { FC } from "react";
import StepCard from "./StepCard";
import type { StepItem } from "../../../types/Home.types";

import Spiral from "../../../assets/images/spiral-icon.svg";
import Star from "../../../assets/images/star-icon.svg";

const Steps: FC = () => {
  const steps: StepItem[] = [
    {
      title: "Choose Store Type",
      desc: "Pick the type of store you want to create. You can start with an online shop or a social media store depending on your needs.",
    },
    {
      title: "Name Your Store",
      desc: "Give your store a unique name and customize your store link. This becomes the identity customers see first.",
    },
    {
      title: "Add Branding",
      desc: "Upload your logo, choose your brand colors, and style your store to match your brand identity.",
    },
    {
      title: "Setup Payment",
      desc: "Connect your preferred payment method so customers can pay you instantly and securely.",
    },
    {
      title: "Launch",
      desc: "Review your setup, publish your store, and start accepting customers immediately.",
    },
  ];

  const [activeStep, setActiveStep] = useState<number>(1);

  return (
    <section className="px-[16px] md:px-[150px] md:pb-40 pb-20 bg-white text-center inter pt-10">
      <h2 className="text-[32px] md:text-[48px] font-bold mb-10 relative">
        Get Started in <span className="text-[var(--primary)]">5 Simple</span>{" "}
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
