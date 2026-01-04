import type { FC } from "react";
import { DollarSign, Clock, AlertTriangle, Repeat } from "lucide-react";
import PaymentSummaryCard from "./PaymentSummaryCard";
import PaymentsTable, { type PaymentRow } from "./PaymentsTable";

interface PaymentsDesktopViewProps {
  payments: PaymentRow[];
  search: string;
  status: "All" | "Completed" | "Processing" | "Failed";
  onSearchChange: (value: string) => void;
  onStatusChange: (value: "All" | "Completed" | "Processing" | "Failed") => void;
}

const PaymentsDesktopView: FC<PaymentsDesktopViewProps> = ({
  payments,
  search,
  status,
  onSearchChange,
  onStatusChange,
}) => {
  return (
    <div className="hidden md:block px-[24px] pt-[20px] space-y-[24px]">
      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-[16px]">
        <PaymentSummaryCard
          title="Total Revenue"
          value="$124,580"
          icon={<DollarSign size={16} />}
          iconBg="bg-[#ECFDF3] text-[#027A48]"
        />
        <PaymentSummaryCard
          title="Pending Payments"
          value="23"
          icon={<Clock size={16} />}
          iconBg="bg-[#FFF7ED] text-[#C2410C]"
        />
        <PaymentSummaryCard
          title="Failed Transactions"
          value="8"
          icon={<AlertTriangle size={16} />}
          iconBg="bg-[#FEF3F2] text-[#B42318]"
        />
        <PaymentSummaryCard
          title="Active Subscriptions"
          value="1,247"
          icon={<Repeat size={16} />}
          iconBg="bg-[#EEF4FF] text-[#3538CD]"
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-[12px]">
        <input
          type="text"
          aria-label="Search transactions"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search transactions..."
          className="h-[36px] w-[240px] px-[12px] text-[13px] border border-[#D1D5DB] rounded-[6px] outline-none bg-white"
        />

        <select
          aria-label="Filter payments by status"
          value={status}
          onChange={(e) =>
            onStatusChange(e.target.value as PaymentsDesktopViewProps["status"])
          }
          className="h-[36px] px-[12px] text-[13px] border border-[#D1D5DB] rounded-[6px] bg-white"
        >
          <option value="All">All Status</option>
          <option value="Completed">Completed</option>
          <option value="Processing">Processing</option>
          <option value="Failed">Failed</option>
        </select>
      </div>

      {/* Table */}
      <PaymentsTable payments={payments} />
    </div>
  );
};

export default PaymentsDesktopView;
