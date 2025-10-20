import React, { useState } from "react";
import type { ChangeEvent } from "react";
import { motion } from "framer-motion";
import { Upload, ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Step4: React.FC = () => {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const navigate = useNavigate();

  const colors: string[] = [
    "#8B5CF6",
    "#7C3AED",
    "#6366F1",
    "#3B82F6",
    "#2563EB",
    "#9333EA",
    "#C026D3",
    "#DB2777",
    "#DC2626",
  ];

  const handleContinue = (): void => {
    navigate("/step5");
  };

  const handleBack = (): void => {
    navigate(-1);
  };

  const handleColorChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSelectedColor(e.target.value);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-[linear-gradient(to_right,#d4b2ff_40%,#ffffff_30%,#7D1EFF40_100%)]">
      {/* Header */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2">
        <img
          src="./Valid2.svg"
          alt="ValidPanel logo"
          className="lg:ml-42 sm:ml-0"
        />
      </div>

      {/* Progress */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-5xl mt-20"
      >
        <p className="font-semibold text-lg text-gray-800">Step 4</p>
        <div className="h-2 bg-white rounded-full mt-2">
          <div className="h-2 bg-purple-600 rounded-full w-3/6"></div>
        </div>
      </motion.div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white rounded-2xl shadow-lg p-8 mt-10 w-full max-w-3xl"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Let’s brand your store
        </h2>
        <p className="text-gray-500 mb-6 text-sm">
          Upload your logo and choose brand colors to make your store uniquely
          yours.
        </p>

        {/* Upload Box */}
        <label className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center mb-8 cursor-pointer hover:border-purple-400 transition">
          <Upload className="w-10 h-10 text-gray-400 mb-2" />
          <p className="text-gray-400 text-sm">PNG, JPG up to 5MB</p>
          <input type="file" accept="image/*" className="hidden" />
        </label>

        {/* Brand Colors */}
        <h3 className="text-gray-800 font-semibold mb-3">Brand Color</h3>
        <p className="text-gray-500 text-sm mb-3">
          Choose a primary color that represents your brand
        </p>

        <div className="flex flex-wrap gap-3 mb-6">
          {colors.map((color, index) => (
            <div
              key={index}
              onClick={() => setSelectedColor(color)}
              className={`w-10 h-10 rounded-lg cursor-pointer transition-all duration-150 ease-in-out ${
                selectedColor === color
                  ? "ring-4 ring-purple-400 scale-110"
                  : "hover:scale-105"
              }`}
              style={{ backgroundColor: color }}
            />
          ))}

          {/* Custom Color Picker */}
          <label
            htmlFor="customColor"
            className="flex items-center justify-center w-10 h-10 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-purple-400 transition"
          >
            <input
              id="customColor"
              type="color"
              onChange={handleColorChange}
              className="opacity-0 absolute w-10 h-10 cursor-pointer"
            />
            <span className="text-gray-400 text-xl">＋</span>
          </label>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between mt-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-purple-700 transition font-medium"
          >
            <ArrowLeft size={18} /> Previous
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleContinue}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition"
          >
            Continue <ArrowRight size={18} />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Step4;
