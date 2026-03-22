import {
  CheckCircle2,
  XCircle,
  Clock,
  CreditCard,
  Ticket,
  Download,
  Loader2,
  FileText,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Payment, PaymentStatus } from "@/types";
import { formatDate } from "@/utils/subscription.utils";
import { downloadInvoice, canDownloadInvoice } from "@/utils/invoice.utils";
import { useCurrencyConverter } from "@/lib/currencyConverter";
import { useAppContext } from "@/context/useAppContext";
import { getCurrencySymbol } from "@/_docs/doc";
import { useState } from "react";
import { toast } from "sonner";

interface PaymentCardProps {
  payment: Payment;
  index: number;
}

const STATUS_CONFIG: Record<
  PaymentStatus,
  { bg: string; text: string; icon: React.ReactNode }
> = {
  SUCCESS: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    icon: <CheckCircle2 size={20} className="text-emerald-600" />,
  },
  PENDING: {
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    icon: <Clock size={20} className="text-yellow-600" />,
  },
  FAILED: {
    bg: "bg-red-50",
    text: "text-red-700",
    icon: <XCircle size={20} className="text-red-600" />,
  },
};

function PaymentCard({ payment, index }: PaymentCardProps) {
  const [downloading, setDownloading] = useState(false);
  const { userCurrency } = useAppContext();
  const convert = useCurrencyConverter();
  const status = payment.status as PaymentStatus;
  const config = STATUS_CONFIG[status];

  const handleDownload = async () => {
    if (!canDownloadInvoice(payment.status)) {
      toast.error("Invoices are only available for successful payments.");
      return;
    }

    try {
      setDownloading(true);
      await downloadInvoice(payment);
      toast.success("Invoice downloaded successfully.");
    } catch (error) {
      console.log(error);
      toast.error("Failed to generate invoice.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={`relative flex flex-col h-full bg-white rounded-[4px] p-6 transition-all duration-300 border border-gray-200 shadow-sm hover:shadow-md ${config.bg}`}
    >
      {/* Status Badge */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        {config.icon}
        <span className={`text-xs font-bold uppercase tracking-wide ${config.text}`}>
          {status}
        </span>
      </div>

      {/* Header */}
      <div className="mb-6 pr-32">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-[4px] bg-gray-100">
            <CreditCard size={20} className="text-gray-600" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-600 font-medium">
              Plan
            </p>
            <h3 className="text-lg font-semibold text-gray-900">
              {payment.plan?.name || "Unknown Plan"}
            </h3>
          </div>
        </div>

        <p className="text-xs text-gray-600 mt-1">
          {formatDate(payment.createdAt)}
        </p>
      </div>

      {/* Price Info */}
      <div className="mb-6 pb-6 border-b border-gray-200/50">
        <p className="text-xs uppercase tracking-wide text-gray-600 font-medium mb-2">
          Total Amount
        </p>
        <p className="poppins text-3xl font-bold text-gray-900">
          {
            convert(
              payment.currency,
              userCurrency,
              payment.finalAmount,
              true,
              false
            ).formatted
          }
        </p>
        <p className="text-xs text-gray-500 mt-2">
          {parseFloat(payment.discountAmount) > 0 && (
            <>
              Original: {getCurrencySymbol(payment.currency)}
              {parseFloat(payment.amount).toFixed(2)}
              <span className="ml-2 text-emerald-600 font-medium">
                -{getCurrencySymbol(payment.currency)}
                {parseFloat(payment.discountAmount).toFixed(2)} discount
              </span>
            </>
          )}
          {parseFloat(payment.discountAmount) === 0 && (
            <>
              Amount: {getCurrencySymbol(payment.currency)}
              {parseFloat(payment.amount).toFixed(2)}
            </>
          )}
        </p>
      </div>

      {/* Coupon (if applied) */}
      {payment.coupon && (
        <div className="mb-6 pb-6 border-b border-gray-200/50">
          <div className="flex items-center gap-2 mb-3">
            <Ticket size={16} className="text-primary" />
            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Coupon Applied
            </p>
          </div>
          <div className="flex items-center justify-between bg-white/60 rounded-[4px] p-3 border border-gray-200/50">
            <span className="font-mono font-bold text-sm text-primary">
              {payment.coupon.code}
            </span>
            <span className="text-xs font-medium text-gray-700 bg-primary/10 px-2 py-1 rounded-[4px]">
              {payment.coupon.type === "PERCENTAGE"
                ? `${payment.coupon.value}% OFF`
                : `${getCurrencySymbol(payment.coupon.currency || payment.currency)}${parseFloat(payment.coupon.value).toFixed(2)} OFF`}
            </span>
          </div>
        </div>
      )}

      {/* Payment Method */}
      <div className="mb-6 pb-6 border-b border-gray-200/50 text-sm">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-600 uppercase tracking-wide font-medium mb-1">
              Method
            </p>
            <p className="text-gray-900 font-medium capitalize">
              {payment.method.replace(/_/g, " ")}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600 uppercase tracking-wide font-medium mb-1">
              Payment ID
            </p>
            <p className="text-gray-900 font-mono text-xs">#{payment.id}</p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      {canDownloadInvoice(payment.status) ? (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleDownload}
          disabled={downloading}
          className="w-full py-2.5 px-4 rounded-[4px] bg-primary hover:bg-primary/90 disabled:opacity-75 disabled:cursor-not-allowed text-white text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2"
        >
          <AnimatePresence mode="wait">
            {downloading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-2"
              >
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating...</span>
              </motion.div>
            ) : (
              <motion.div
                key="default"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Invoice</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      ) : (
        <div className="w-full py-2.5 px-4 rounded-[4px] bg-gray-100 text-gray-500 text-sm font-medium flex items-center justify-center gap-2">
          <FileText className="w-4 h-4" />
          <span>Not Available</span>
        </div>
      )}
    </motion.div>
  );
}

export default PaymentCard;
