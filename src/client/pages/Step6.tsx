import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface PaymentOption {
  img: string;
  title: string;
  desc: string;
  bg: string;
  defaultChecked?: boolean;
}

const Step6: React.FC = () => {
  const navigate = useNavigate();

  const handlePayNow = (): void => {
    navigate("/onboarding/step7");
  };

  const handleBack = (): void => {
    navigate("/onboarding/step5");
  };

  const paymentOptions: PaymentOption[] = [
    {
      img: "/Card.svg",
      title: "Credit Card",
      desc: "Visa, Mastercard & others",
      bg: "bg-purple-100",
      defaultChecked: true,
    },
    {
      img: "/Paypal.svg",
      title: "PayPal",
      desc: "Pay easily with your PayPal account",
      bg: "bg-blue-100",
    },
    {
      img: "/Apple.svg",
      title: "Apple Pay",
      desc: "Quick checkout with Apple Pay",
      bg: "bg-purple-50",
    },
    {
      img: "/Google.svg",
      title: "Google Pay",
      desc: "Pay directly using your Google account",
      bg: "bg-purple-100",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-[linear-gradient(to_right,#7D1EFF40_40%,#ffffff_30%,#d4b2ff_100%)] relative">
      {/* Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl p-8"
      >
        {/* Logo */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2">
          <img
            src="/Valid2.svg"
            alt="ValidPanel logo"
            className="w-24 sm:w-28 md:w-32 lg:ml-80 lg:w-full object-contain"
          />
        </div>

        <div className="mt-16">
          <p className="text-lg font-bold mb-2">Step 6</p>
          <div className="h-2 bg-white rounded-full">
            <div className="h-2 bg-purple-600 rounded-full w-3/4"></div>
          </div>
        </div>

        {/* Title */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mt-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Payment Method
          </h1>
          <p className="text-gray-500 text-sm mb-6 text-center">
            Select the payment method you’d like to use for this subscription.
          </p>

          {/* Payment Options */}
          <div className="space-y-3">
            {paymentOptions.map(({ img, title, desc, bg, defaultChecked }) => (
              <label
                key={title}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-xl cursor-pointer hover:border-purple-500 transition"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-9 flex items-center justify-center ${bg} rounded-lg`}
                  >
                    <img src={img} alt={title} className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{title}</h4>
                    <p className="text-sm text-gray-500">{desc}</p>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment"
                  className="accent-purple-600"
                  defaultChecked={defaultChecked}
                />
              </label>
            ))}
          </div>

          {/* Order Summary */}
          <div className="mt-6 border-t border-gray-200 pt-4">
            <h3 className="font-semibold text-gray-800 mb-2">Order Summary</h3>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Pro Plan - Monthly</span>
              <span>$29.99</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>VAT (10%)</span>
              <span>$3.00</span>
            </div>
            <div className="flex justify-between text-base font-semibold text-gray-800 mt-2">
              <span>Total</span>
              <span>$32.99</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={handleBack}
              className="text-gray-700 font-medium hover:text-purple-700 transition"
            >
              ← Back
            </button>

            <button
              onClick={handlePayNow}
              className="bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 transition"
            >
              Pay Now →
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Step6;
