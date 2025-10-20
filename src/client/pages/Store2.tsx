import React, { useState, type JSX } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Define type for each plan
interface Plan {
  title: string;
  price: string;
  description: string;
  features: string[];
}

const Step2: React.FC = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);

  // Handle navigation when user clicks "Continue"
  const handleContinue = (): void => {
    if (selected) {
      // Validation can be added here
      navigate("/step3");
    }
  };

  const plansTop: Plan[] = [
    {
      title: "Free Plan",
      price: "$0",
      description: "Start selling with basic tools.",
      features: ["1 store", "Default branding only", "Basic payments"],
    },
    {
      title: "Essential Plan",
      price: "$9",
      description: "Essential features for your first store.",
      features: ["Up to 2 stores", "Custom logo & color", "Standard payments"],
    },
    {
      title: "Pro Plan",
      price: "$29.99",
      description: "Advanced tools to grow faster.",
      features: [
        "Up to 3 stores",
        "Full branding customization",
        "Priority support",
        "Advanced payments",
      ],
    },
  ];

  const plansBottom: Plan[] = [
    {
      title: "Business Plan",
      price: "$40",
      description: "Scale with multiple stores and premium support.",
      features: [
        "Up to 10 stores",
        "Custom domains",
        "Team collaboration",
        "Analytics dashboard",
      ],
    },
    {
      title: "Empire Plan",
      price: "$59",
      description: "Everything you need to dominate.",
      features: [
        "Unlimited stores",
        "Dedicated account manager",
        "Premium analytics & reporting",
        "Early access to new features",
      ],
    },
  ];

  const renderPlanCard = (
    plan: Plan,
    index: number,
    groupKey: string
  ): JSX.Element => (
    <div
      key={`${groupKey}-${index}`}
      onClick={() => setSelected(`${groupKey}-${index}`)}
      className={`cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border-2 ${
        selected === `${groupKey}-${index}`
          ? "border-purple-500 shadow-purple-200"
          : "border-transparent"
      } p-6 flex flex-col justify-between w-full sm:w-[300px]`}
    >
      <div className="px-4">
        <h3 className="text-xl font-semibold text-gray-800">{plan.title}</h3>
        <div className="flex items-baseline gap-1 mt-2">
          <p className="text-black font-bold text-2xl">{plan.price}</p>
          <span className="text-gray-700 text-xl">/month</span>
        </div>
        <p className="text-gray-500 mt-2 text-sm">{plan.description}</p>
        <ul className="mt-4 space-y-2">
          {plan.features.map((f, idx) => (
            <li
              key={idx}
              className="text-gray-600 text-sm flex items-center gap-2"
            >
              <Check size={16} className="text-green-500" />
              {f}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-[linear-gradient(to_right,#d4b2ff_40%,#ffffff_30%,#d4b2ff_100%)]">
      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl mb-10"
      >
        <div>
          <img src="/Valid2.svg" alt="ValidPanel Logo" />
        </div>
        <p className="text-xl font-semibold mb-2 text-black">Step 2</p>
        <div className="h-2 bg-white rounded-full">
          <div className="h-2 bg-purple-600 rounded-full w-2/5"></div>
        </div>
      </motion.div>

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Choose Your Plan
        </h1>
        <p className="text-gray-500 max-w-md mx-auto">
          Select the plan that fits your business <br /> journey.
        </p>
      </motion.div>

      {/* Plans */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-wrap justify-center gap-6 mb-10 w-full"
      >
        {plansTop.map((plan, i) => renderPlanCard(plan, i, "top"))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className="flex flex-wrap justify-center gap-6"
      >
        {plansBottom.map((plan, i) => renderPlanCard(plan, i, "bottom"))}
      </motion.div>

      {/* Continue Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={!selected}
        onClick={handleContinue}
        className={`mt-12 font-semibold px-10 py-3 rounded-xl shadow-md transition ${
          selected
            ? "bg-purple-600 hover:bg-purple-700 text-white"
            : "bg-gray-300 text-gray-600 cursor-not-allowed"
        }`}
      >
        Continue
      </motion.button>
    </div>
  );
};

export default Step2;
