import React, { useState } from "react";
import { ShoppingBag, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const StepOne: React.FC = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);

  const handleNext = (): void => {
    if (selected) {
      navigate("/onboarding/step2");
    }
  };

  const handleSelect = (option: string): void => {
    setSelected(option);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-[linear-gradient(to_right,#d4b2ff_40%,#ffffff_30%,#d4b2ff_100%)]">
      {/* Container */}
      <div className="max-w-5xl w-full">
        {/* Header Section */}
        <div className="lg:flex sm:grid grid-cols-1 items-center justify-between p-8">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img src="./Valid2.svg" alt="ValidPanel Logo" />
          </div>
          {/* Step Title */}
          <div className="flex flex-col items-center mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Let’s Get Started
            </h2>
            <p className="text-gray-700 mt-2">
              What type of store would you like to create
            </p>
          </div>
          <div className="w-16"></div> {/* Spacer */}
        </div>

        {/* Progress Bar */}
        <div className="px-12 mb-4">
          <h3 className="font-semibold text-lg text-gray-800 mb-2">Step 1</h3>
          <div className="w-full bg-white h-2 rounded-full">
            <div className="bg-purple-600 h-1 w-1/5 rounded-full p-1"></div>
          </div>
        </div>

        {/* Store Options */}
        <div className="grid md:grid-cols-2 gap-6 lg:px-36 sm:px-14 pb-10 pt-6">
          {/* Shop Card */}
          <div
            onClick={() => handleSelect("shop")}
            className={`cursor-pointer bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-2xl border-2 transition-all
              ${selected === "shop" ? "border-purple-600" : "border-gray-200"}`}
          >
            <div className="mx-auto bg-gradient-to-r from-purple-500 to-purple-700 w-14 h-14 flex items-center justify-center rounded-xl mb-4">
              <ShoppingBag className="text-white w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Shop</h3>
            <p className="text-gray-600 text-sm mb-4">
              Perfect for selling physical products. <br />
              Create a professional storefront with product catalogs, inventory
              management, and payment processing.
            </p>
            <div className="flex justify-center space-x-2">
              <span className="bg-[#DCFCE7] text-green-700 text-xs px-3 py-1 rounded-full">
                Physical Goods
              </span>
              <span className="bg-[#F3E8FF] text-[#7E22CE] text-xs px-3 py-1 rounded-full">
                Inventory
              </span>
            </div>
          </div>

          {/* Social Media Store Card */}
          <div
            onClick={() => handleSelect("social")}
            className={`cursor-pointer bg-white shadow-lg rounded-2xl p-6 text-center hover:shadow-2xl transition-all border-2
              ${
                selected === "social" ? "border-purple-600" : "border-gray-200"
              }`}
          >
            <div className="mx-auto bg-gradient-to-r from-pink-500 to-orange-400 w-14 h-14 flex items-center justify-center rounded-xl mb-4">
              <Share2 className="text-white w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Social Media Store
            </h3>
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
              Ideal for reselling online services and social media solutions.
              Offer Instagram followers, YouTube views, website traffic, and
              more digital services.
            </p>
            <div className="flex justify-center space-x-2 flex-wrap">
              <span className="bg-pink-100 text-pink-700 text-xs px-3 py-1 rounded-full">
                Social Services
              </span>
              <span className="bg-orange-100 text-orange-700 text-xs px-3 py-1 rounded-full">
                Digital Marketing
              </span>
              <span className="bg-yellow-100 text-yellow-700 text-xs px-3 py-1 rounded-full">
                Reselling
              </span>
            </div>
          </div>
        </div>

        {/* Next Button */}
        <div className="flex justify-end px-12 pb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            disabled={!selected}
            className={`mt-12 font-semibold px-10 py-3 rounded-xl shadow-md transition 
              ${
                selected
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
          >
            Next
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default StepOne;
