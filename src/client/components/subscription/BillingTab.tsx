import { useState } from "react";
import Loader from "@/components/Loader";
import NotFound from "@/components/NotFound";
import type { Payment, PaymentStatus } from "@/types";
import { formatDate, getPaymentStatusIcon } from "@/utils/subscription.utils";
import { downloadInvoice, canDownloadInvoice } from "@/utils/invoice.utils";
import { motion, AnimatePresence } from "framer-motion";
import { Download, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";

function BillingTab({
  payments,
  isLoading,
}: {
  payments: Payment[];
  isLoading: boolean;
}) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownloadInvoice = async (payment: Payment) => {
    if (!canDownloadInvoice(payment.status)) {
      toast.error("Invoices are only available for successful payments.");
      return;
    }

    try {
      setDownloadingId(payment.uid);
      await downloadInvoice(payment);

      toast.success("Your invoice has been downloaded successfully.");
    } catch (error) {
      console.log(error);
      toast.error("Failed to generate invoice. Please try again.");
    } finally {
      setDownloadingId(null);
    }
  };

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
                    {canDownloadInvoice(payment.status) ? (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleDownloadInvoice(payment)}
                        disabled={downloadingId === payment.uid}
                        className="relative px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-primary/90 hover:shadow-lg disabled:opacity-75 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        <div className="flex items-center space-x-2">
                          <AnimatePresence mode="wait">
                            {downloadingId === payment.uid ? (
                              <motion.div
                                key="loading"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="flex items-center space-x-2"
                              >
                                <Loader2 className="w-4 h-4 text-white animate-spin" />
                                <span className="inter text-sm font-semibold text-white">
                                  Generating...
                                </span>
                              </motion.div>
                            ) : (
                              <motion.div
                                key="default"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="flex items-center space-x-2"
                              >
                                <Download className="w-4 h-4 text-white" />
                                <span className="inter text-sm font-semibold text-white">
                                  Invoice
                                </span>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.button>
                    ) : (
                      <div className="flex items-center space-x-2 text-gray-400">
                        <FileText className="w-4 h-4" />
                        <span className="inter text-sm">Not Available</span>
                      </div>
                    )}
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
