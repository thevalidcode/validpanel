import type { JSX } from "react";
import type { PaymentStatus, SubscriptionStatus } from "@/types";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";

export const formatDate = (dateString: Date | string): string =>
  new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export const getDaysRemaining = (expiresAt: string): number => {
  const diff = new Date(expiresAt).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export const getStatusColor = (status: SubscriptionStatus): string => {
  const map: Record<SubscriptionStatus, string> = {
    ACTIVE: "bg-green-100 text-green-700 border-green-200",
    PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
    EXPIRED: "bg-red-100 text-red-700 border-red-200",
    TRIAL: "bg-blue-100 text-blue-700 border-blue-200",
    CANCELED: "bg-gray-100 text-gray-700 border-gray-200",
  };

  return map[status];
};

export const getPaymentStatusIcon = (status: PaymentStatus): JSX.Element => {
  if (status === "SUCCESS") {
    return <CheckCircle2 className="w-4 h-4 text-green-600" />;
  }

  if (status === "PENDING") {
    return <Clock className="w-4 h-4 text-yellow-600" />;
  }

  return <AlertCircle className="w-4 h-4 text-red-600" />;
};
