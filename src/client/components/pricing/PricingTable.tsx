import { motion } from "framer-motion";
import { mockPlans } from "./PricingCard";

function PricingTable() {
  const tableData = [
    {
      feature: "Stores allowed",
      free: "1",
      standard: "5",
      pro: "Unlimited",
      business: "Unlimited",
      empire: "Unlimited",
    },
    {
      feature: "Custom Domain",
      free: false,
      standard: true,
      pro: true,
      business: true,
      empire: true,
    },
    {
      feature: "Unlimited Products",
      free: false,
      standard: true,
      pro: true,
      business: true,
      empire: true,
    },
    {
      feature: "Support Type",
      free: "Email",
      standard: "Chat",
      pro: "Priority",
      business: "Priority",
      empire: "Dedicated",
    },
    {
      feature: "Store Analytics",
      free: false,
      standard: false,
      pro: true,
      business: true,
      empire: true,
    },
    {
      feature: "Custom Branding",
      free: false,
      standard: true,
      pro: true,
      business: true,
      empire: true,
    },
    {
      feature: "API Access",
      free: false,
      standard: false,
      pro: false,
      business: true,
      empire: true,
    },
    {
      feature: "White Label",
      free: false,
      standard: false,
      pro: false,
      business: true,
      empire: true,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-16"
    >
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
        Compare plan & <span className="text-purple-600">features</span>
      </h2>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                  Features
                </th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700">
                  Free
                </th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700">
                  Standard
                </th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700">
                  Pro
                </th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700">
                  Business
                </th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700">
                  Empire
                </th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-6 text-sm text-gray-700 font-medium">
                    {row.feature}
                  </td>
                  {["free", "standard", "pro", "business", "empire"].map(
                    (plan) => (
                      <td key={plan} className="py-4 px-6 text-center">
                        {typeof row[plan as keyof typeof row] === "boolean" ? (
                          row[plan as keyof typeof row] ? (
                            <svg
                              className="w-5 h-5 text-purple-600 mx-auto"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <span className="text-gray-300">-</span>
                          )
                        ) : (
                          <span className="text-sm text-gray-700">
                            {row[plan as keyof typeof row] as string}
                          </span>
                        )}
                      </td>
                    )
                  )}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom pricing cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-8">
        {mockPlans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="text-3xl font-bold text-gray-900 mb-1">
              ${plan.price}
            </div>
            <div className="text-xs text-gray-500 uppercase mb-3">
              per month
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm font-semibold rounded-full hover:from-purple-700 hover:to-purple-800 transition-all"
            >
              Upgrade
            </motion.button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default PricingTable;
