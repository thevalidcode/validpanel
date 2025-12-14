import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import DomainInput from "../components/DomainInput";

const Step3: React.FC = () => {
  const navigate = useNavigate();

  const [storeName, setStoreName] = useState<string>("");
  const [domain, setDomain] = useState<string>("");
  const [useCustomDomain, setUseCustomDomain] = useState<boolean>(false);

  const handleContinue = (): void => {
    // You can validate here before navigating
    navigate("/onboarding/step4");
  };

  const handleToggleDomain = (): void => {
    setUseCustomDomain((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-10 py-10 bg-[linear-gradient(to_right,#d4b2ff_40%,#ffffff_30%,#d4b2ff_100%)] relative overflow-hidden">
      {/* Logo (fixed top-left for all screens) */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2">
        <img
          src="/Valid2.svg"
          alt="ValidPanel logo"
          className="lg:ml-76 sm:ml-0"
        />
      </div>

      {/* Step Progress */}
      <div className="w-full max-w-3xl mt-20 sm:mt-24 mb-10 px-2">
        <p className="text-xl sm:text-2xl font-bold mb-2 text-black text-center sm:text-left">
          Step 3
        </p>
        <div className="h-2 bg-white rounded-full">
          <div className="h-2 bg-purple-600 rounded-full w-2/5"></div>
        </div>
      </div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-lg rounded-2xl p-6 sm:p-8 w-full max-w-md sm:max-w-xl md:max-w-2xl"
      >
        <h2 className="text-xl sm:text-2xl font-semibold text-center mb-2">
          Name Your Store
        </h2>
        <p className="text-gray-500 text-center mb-8 text-sm sm:text-base">
          Give your store a name and choose your custom link.
        </p>

        {/* Store Name */}
        <div className="mb-6">
          <label
            htmlFor="storeName"
            className="block text-gray-700 font-medium mb-2 text-sm sm:text-base"
          >
            Store Name
          </label>
          <input
            id="storeName"
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            placeholder="Enter your store name"
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm sm:text-base focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Domain Setup */}
        <DomainInput
          label="Domain Setup"
          value={domain}
          onChange={setDomain}
          useCustomDomain={useCustomDomain}
          onToggleCustomDomain={handleToggleDomain}
          required
        />

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 mt-8">
          <button
            type="button"
            onClick={() => navigate("/onboarding/step2")}
            className="text-gray-600 font-medium flex items-center space-x-1 hover:text-gray-800 transition"
          >
            <span>←</span>
            <span>Back</span>
          </button>
          <button
            onClick={handleContinue}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md font-medium w-full sm:w-auto transition"
          >
            Continue →
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Step3;
