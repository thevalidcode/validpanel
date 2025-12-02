import React, { useState, type JSX } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PaymentMethod {
  id: number;
  title: string;
  description: string;
  icon: JSX.Element;
  details: JSX.Element;
}

const Step5: React.FC = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleContinue = (): void => {
    if (selected) {
      navigate("/onboarding/step6"); // go to step 6 after selecting a payment method
    } else {
      alert("Please select a payment method first.");
    }
  };

  const handleBack = (): void => {
    navigate("/onboarding/step4"); // go back to previous step
  };

  const paymentMethods: PaymentMethod[] = [
    {
      id: 1,
      title: "Bank Transfer",
      description: "Direct bank account transfers",
      icon: <img src="./Frame.svg" alt="bank" className="w-7 h-7" />,
      details: (
        <div className="mt-4 text-sm text-gray-600 grid grid-cols-1 sm:grid-cols-2 gap-y-3">
          <p>
            <span className="text-gray-800">Bank Name:</span> <br />
            <span className="font-bold">
              First Bank <br />
              of Nigeria
            </span>
          </p>
          <p>
            <span className="text-gray-800 sm:ml-8">Account Number:</span>{" "}
            <br />
            <span className="font-bold sm:ml-8">1234567890</span>
          </p>
          <p>
            <span className="text-gray-800">Account Name:</span> <br />
            <span className="font-bold">
              Your Business <br /> Name
            </span>
          </p>
          <p>
            <span className="text-gray-800 sm:ml-8">Sort Code:</span> <br />
            <span className="font-bold sm:ml-8">011-151-003</span>
          </p>
        </div>
      ),
    },
    {
      id: 2,
      title: "Flutterwave",
      description: "Accept cards and online payments",
      icon: <img src="./svg.svg" alt="flutterwave" className="w-7 h-7" />,
      details: (
        <div className="flex items-center gap-2 mt-3">
          <img src="./Secureicon.svg" alt="secure" className="w-4 h-4" />
          <span className="text-green-600 text-sm font-medium">
            Secure payment processing
          </span>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-10 py-10 bg-[linear-gradient(to_right,#d4b2ff_40%,#ffffff_30%,#d4b2ff_100%)]">
      {/* Step header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10 w-full"
      >
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 mb-4">
          <img
            src="./Valid2.svg"
            alt="ValidPanel logo"
            className="mb-6 sm:w-28 md:w-32 lg:w-full lg:ml-60 object-contain"
          />
        </div>
        <br />
        <br />
        <br />
        <br />
        <p className="font-semibold text-xl text-left max-w-4xl mx-auto">
          Step 5
        </p>
        <div className="h-2 bg-white rounded-full mt-2 max-w-4xl mx-auto">
          <div className="h-2 bg-purple-600 rounded-full w-3/5"></div>
        </div>
      </motion.div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white rounded-2xl shadow-md p-6 sm:p-8 w-full max-w-md sm:max-w-xl lg:max-w-2xl"
      >
        <h1 className="text-2xl sm:text-3xl text-gray-800 mb-3 text-center">
          Set Your Payment Method
        </h1>
        <p className="text-gray-500 max-w-md mx-auto text-center mb-6 text-sm sm:text-base">
          Choose how you want to receive payments from your customers.
        </p>

        {paymentMethods.map((method) => (
          <div
            key={method.id}
            onClick={() => setSelected(method.id)}
            className={`border rounded-xl p-5 mb-5 cursor-pointer transition-all duration-300 ${
              selected === method.id
                ? "border-purple-600 shadow-purple-200 shadow-sm"
                : "border-gray-200 hover:border-purple-300"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start gap-3">
              <input
                title="method"
                type="radio"
                checked={selected === method.id}
                onChange={() => setSelected(method.id)}
                className="accent-purple-600 mt-1"
              />
              <div className="flex items-start gap-3 flex-1">
                <div className="bg-gray-100 p-2 rounded-lg">{method.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {method.title}
                  </h3>
                  <p className="text-gray-500 text-sm">{method.description}</p>
                  {method.details}
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 border px-5 py-2 rounded-lg hover:bg-gray-100 transition w-full sm:w-auto justify-center"
          >
            <ArrowLeft size={16} /> Back
          </button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleContinue}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-xl shadow-md transition w-full sm:w-auto justify-center"
          >
            Continue <ArrowRight size={18} />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Step5;
