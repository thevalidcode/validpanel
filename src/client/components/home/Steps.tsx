import { type FC } from "react";
import StepCard from "./StepCard";
import type { StepItem } from "../../../types/Home.types";

const Steps: FC = () => {
  const steps: StepItem[] = [
    { title: "Choose Store Type", desc: "" },
    { title: "Name Your Store", desc: "Pick a unique name and customize your store link(subdomain)." },
    { title: "Add Branding", desc: "" },
    { title: "Setup Payment", desc: "" },
    { title: "Launch", desc: "" },
  ];

  return (
    <section className="px-6 md:px-10 py-16 bg-white text-center">
      <h2 className="text-2xl md:text-3xl font-bold mb-10">
        Get Started in <span className="text-purple-600">5 Simple</span> Steps
      </h2>
      <div className="grid gap-4 md:flex md:justify-center md:items-center max-w-6xl mx-auto text-none">
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