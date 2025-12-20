import type { StoreStatus } from "@/types";
import type { FC } from "react";

export const StatusBadge: FC<{ status: StoreStatus }> = ({ status }) => {
  const baseClasses = "px-2.5 py-0.5 text-xs font-medium rounded-full";
  const statusClasses: Record<StoreStatus, string> = {
    ACTIVE: "bg-green-100 text-green-800",
    PENDING: "bg-yellow-100 text-yellow-800",
    CANCELED: "bg-red-100 text-red-800",
    DISABLED: "bg-gray-100 text-gray-800",
    EXPIRED: "bg-orange-100 text-orange-800",
  };
  return (
    <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>
  );
};