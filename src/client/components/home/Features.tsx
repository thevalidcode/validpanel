import { type FC } from "react";
import { FaStore, FaMoneyBillWave, FaMobileAlt, FaCogs, FaBolt } from "react-icons/fa";
import FeatureCard from "./FeatureCard";
import type { FeatureItem } from "../../../types/Home.types";

const Features: FC = () => {
  const features: FeatureItem[] = [
    {
      title: "Easy Store Creation",
      desc: "Get up & running in minutes with step-by-step onboarding.",
      icon: <FaStore />,
    },
    {
      title: "Instant Payments",
      desc: "Get paid instantly through integrated payment gateways.",
      icon: <FaMoneyBillWave />,
    },
    {
      title: "Mobile Optimized",
      desc: "Your store looks beautiful on every screen size.",
      icon: <FaMobileAlt />,
    },
    {
      title: "No Tech Skills Needed",
      desc: "Beginner-friendly. Build with zero coding experience.",
      icon: <FaCogs />,
    },
    {
      title: "Fast Setup",
      desc: "Your store can be ready in under 10 minutes.",
      icon: <FaBolt />,
    },
  ];

  return (
    <section className="px-[16px] md:px-[150px] md:pb-40 pb-20 min-h-[70vh] flex items-center bg-gray-50">
      <div className="grid md:grid-cols-12 md:grid-rows-2 gap-6">
        {/* Left Feature - Purple Card */}
        <div className="bg-[var(--primary)] text-white rounded-xl p-6 md:col-span-6 flex flex-col justify-between md:pb-15">
          <div>
            <h3 className="text-xl font-bold mb-2">
              Everything You Need to Launch and Run Your Online Store
            </h3>
            <p className="text-sm text-purple-100">
              Launch in minutes, manage products, and get paid — all in one simple platform.
            </p>
          </div>
          <button
            className="mt-6 bg-white cursor-pointer btn-custom text-[var(--primary)] px-4 py-2 rounded-full font-semibold text-sm self-start"
            type="button"
          >
            Create Your Free Store
          </button>
        </div>
        <FeatureCard
          icon={features[0].icon}
          title={features[0].title}
          desc={features[0].desc}
          classes="md:col-span-3"
        />
        <FeatureCard
          icon={features[1].icon}
          title={features[1].title}
          desc={features[1].desc}
          classes="md:col-span-3"
        />
        <FeatureCard
          icon={features[2].icon}
          title={features[2].title}
          desc={features[2].desc}
          classes="md:col-span-4"
        />
        <FeatureCard
          icon={features[3].icon}
          title={features[3].title}
          desc={features[3].desc}
          classes="md:col-span-4"
        />
        <FeatureCard
          icon={features[4].icon}
          title={features[4].title}
          desc={features[4].desc}
          classes="md:col-span-4"
        />
      </div>
    </section>
  );
};

export default Features;