import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Step7: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = (): void => {
    navigate("/onboarding/step6");
  };

  const handleContinue = (): void => {
    navigate("/stores");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-[linear-gradient(to_right,#d4b2ff_40%,#ffffff_30%,#d4b2ff_100%)]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10 w-full"
      >
        <div className="max-w-6xl mx-auto">
          <img src="/Valid2.svg" alt="ValidPanel Logo" className="w-30" />
        </div>
        <p className="font-bold text-xl text-left ml-36">Step 7</p>
        <div className="w-full max-w-6xl mx-auto mt-2">
          <div className="h-2 bg-white rounded-full">
            <div className="h-2 bg-purple-600 rounded-full w-full"></div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="rounded-2xl p-8 md:p-10 max-w-6xl w-full grid md:grid-cols-3 gap-6"
      >
        {/* Left Section */}
        <div className="md:col-span-2 bg-white rounded-2xl p-6 md:p-10 shadow-lg flex flex-col">
          <div className="flex flex-col items-center text-center">
            <div className="bg-gradient-to-r from-[#6A0DAD] to-[#8B5CF6] rounded-full p-3 mb-4">
              <Check className="text-white w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              You’re All Set!
            </h2>
            <p className="text-gray-500 mb-6 max-w-md">
              Review your details and launch your store. Your online business is
              just one click away from going live.
            </p>
          </div>

          {/* Store Summary */}
          <div className="bg-purple-50 rounded-xl p-6 shadow-inner mb-6">
            <h3 className="font-semibold text-gray-800 mb-4">Store Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                {
                  img: "./Store.svg",
                  title: "Store Type",
                  desc: "E-commerce Store",
                  bg: "bg-[#DBEAFE]",
                },
                {
                  img: "./Logo.svg",
                  title: "Logo",
                  desc: "Custom Design",
                  bg: "bg-[#FFEDD5]",
                },
                {
                  img: "./Fashion.svg",
                  title: "Store Name",
                  desc: "Trendy Fashion Hub",
                  bg: "bg-[#F3E8FF]",
                },
                {
                  img: "./Card2.svg",
                  title: "Payment",
                  desc: "Stripe • Connected",
                  bg: "bg-[#D1FAE5]",
                },
                {
                  img: "./URL.svg",
                  title: "Domain",
                  desc: "trendyfashionhub.com",
                  bg: "bg-[#DCFCE7]",
                },
                {
                  img: "./Star.svg",
                  title: "Features",
                  desc: "Premium Plan",
                  bg: "bg-[#E0E7FF]",
                },
              ].map(({ img, title, desc, bg }, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={`p-3 ${bg} rounded-lg`}>
                    <img src={img} alt={title} />
                  </div>
                  <div>
                    <p className="text-gray-600">{title}</p>
                    <p className="font-semibold text-gray-800">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={handleBack}
              className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition"
            >
              ← Back
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary hover:bg-purple-700 text-white font-semibold px-6 py-4 rounded-lg shadow-md transition"
              onClick={handleContinue}
            >
              <div className="flex items-center gap-2 animate-pulse hover:animate-none">
                <img src="./Jet.svg" alt="Jet" /> <span>Launch Store</span>
              </div>
            </motion.button>
          </div>
        </div>

        {/* Right Section */}
        <div className="space-y-4">
          {/* Checklist */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h4 className="font-semibold text-gray-800 mb-3">
              Pre-Launch Checklist
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              {[
                "Store configuration completed",
                "Payment gateway connected",
                "Domain configured",
                "SSL certificate active",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                    <Check size={16} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Next Steps */}
          <div className="bg-gradient-to-r from-[#8B5CF60D] to-[#6A0DAD0D] rounded-xl p-5 shadow-sm border border-purple-400 w-full">
            <h4 className="font-semibold text-gray-800 mb-3">What’s Next?</h4>
            <ul className="space-y-3 text-sm">
              {[
                {
                  num: 1,
                  title: "Add Products",
                  desc: "Start adding your products to the store",
                },
                {
                  num: 2,
                  title: "Configure Shipping",
                  desc: "Set up your delivery options",
                },
                {
                  num: 3,
                  title: "Marketing Setup",
                  desc: "Plan how to promote your store",
                },
              ].map(({ num, title, desc }) => (
                <li key={num} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-300 border border-purple-400 flex items-center justify-center text-sm font-semibold text-purple-600">
                    {num}
                  </div>
                  <p className="text-gray-700 whitespace-pre-line">
                    {title}
                    {"\n"}
                    {desc}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 text-center shadow-sm">
            <div className="flex justify-center mb-3">
              <div className="bg-blue-50 rounded-full p-2">
                <img src="./Help.svg" alt="Help" />
              </div>
            </div>
            <h4 className="font-semibold text-gray-800">Need Help?</h4>
            <p className="text-sm text-gray-500 mb-3">
              Our support team is here to help you get started
            </p>
            <button className="text-[#2563EB] hover:animate-pulse font-medium text-sm bg-[#EFF6FF] px-20 py-2 rounded-lg transition">
              Contact Support
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Step7;
