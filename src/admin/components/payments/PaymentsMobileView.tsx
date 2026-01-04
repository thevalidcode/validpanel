import type { FC } from "react";
import {
  CalendarDays,
  TrendingUp,
  Menu,
} from "lucide-react";
import StatusBadge from "@/admin/components/common/StatusBadge";

export interface MobilePayment {
  id: string;
  user: {
    name: string;
    avatar: string;
    plan: string;
  };
  method: string;
  amount: string;
  status: "Pending" | "Completed" | "Failed";
  note?: string;
}

interface Props {
  payments: MobilePayment[];
  search: string;
  status: "All" | "Pending" | "Completed" | "Failed";
  date: string | null;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: Props["status"]) => void;
  onDateChange: (value: string | null) => void;
}

const PaymentsMobileView: FC<Props> = ({
  payments,
  status,
  date,
  onStatusChange,
  onDateChange,
}) => {
  return (
    <div className="md:hidden bg-white min-h-screen">
      {/* Header */}
      <div className="h-[48px] px-[16px] flex items-center justify-between border-b border-[#E5E7EB]">
        <Menu size={20} />
        <p className="text-[16px] font-medium">Payment</p>
        <div className="w-[20px]" />
      </div>

      <div className="px-[16px] pt-[14px] space-y-[16px]">
        {/* Filter chips */}
        <div className="flex flex-wrap gap-[8px]">
          <button
            onClick={() =>
              onStatusChange(status === "Pending" ? "All" : "Pending")
            }
            className={`h-[28px] px-[10px] rounded-[6px] text-[12px]
              ${
                status === "Pending"
                  ? "bg-[#F4EBFF] text-[#7C3AED]"
                  : "border border-[#E5E7EB]"
              }`}
          >
            Pending
          </button>

          <button
            onClick={() =>
              onDateChange(date ? null : "2024-01-15")
            }
            className="flex items-center gap-[6px] h-[28px] px-[10px] rounded-[6px] border border-[#E5E7EB] text-[12px]"
          >
            <CalendarDays size={14} />
            Date
          </button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-[12px]">
          <div className="rounded-[10px] bg-[#ECFDF3] px-[12px] py-[12px]">
            <div className="flex items-center gap-[6px] text-[#027A48]">
              <TrendingUp size={14} />
              <span className="text-[11px] font-medium">
                Total Revenue
              </span>
            </div>
            <p className="mt-[4px] text-[16px] font-semibold text-[#027A48]">
              $24,589
            </p>
          </div>
        </div>

        {/* Payments list */}
        <div className="space-y-[12px]">
          {payments.map((p) => (
            <div
              key={p.id}
              className="border border-[#E5E7EB] rounded-[12px] px-[12px] py-[12px]"
            >
              <div className="flex justify-between">
                <div className="flex gap-[10px]">
                  <img
                    src={p.user.avatar}
                    className="w-[36px] h-[36px] rounded-full"
                  />
                  <div>
                    <p className="text-[13px] font-medium">
                      {p.user.name}
                    </p>
                    <p className="text-[11px] text-[#6B7280]">
                      {p.user.plan}
                    </p>
                  </div>
                </div>
                <StatusBadge status={p.status} />
              </div>

              <div className="mt-[12px] flex justify-between text-[12px]">
                <span className="text-[#6B7280]">{p.method}</span>
                <span className="font-semibold">{p.amount}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaymentsMobileView;
