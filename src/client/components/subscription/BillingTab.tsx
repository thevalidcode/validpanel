import Loader from "@/components/Loader";
import NotFound from "@/components/NotFound";
import { useGetUserPayments } from "@/hooks/use-payment";
import type { PaymentStatus } from "@/types";
import { formatDate, getPaymentStatusIcon } from "@/utils/subscription.utils";
import { motion } from "framer-motion";
import { Download } from "lucide-react";

function BillingTab() {
  const { data: payments, isLoading } = useGetUserPayments();

  if (isLoading) {
    return <Loader />;
  }

  if (!payments) {
    return <NotFound title="No payment has been made yet." variant="page" />;
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="poppins text-xl font-bold text-gray-900">
            Payment History
          </h2>
          <p className="inter text-sm text-gray-600 mt-1">
            View and download all your invoices
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left inter text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left inter text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-4 text-left inter text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left inter text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left inter text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Invoice
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {payments.map((payment, index) => (
                <motion.tr
                  key={payment.uid}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="inter text-sm text-gray-900">
                      {formatDate(payment.createdAt)}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="inter text-sm font-medium text-gray-900">
                      {payment.plan.name}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="poppins text-sm font-semibold text-gray-900">
                      ${payment.amount} {payment.currency}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getPaymentStatusIcon(payment.status as PaymentStatus)}
                      <span className="inter text-sm text-gray-700">
                        {payment.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span className="inter text-sm font-medium">
                        Download
                      </span>
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

export default BillingTab;
