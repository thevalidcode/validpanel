import type { FC } from "react";
import { Eye, MoreHorizontal } from "lucide-react";
import StatusBadge from "@/admin/components/common/StatusBadge";

export interface PaymentRow {
  transactionId: string;
  user: {
    name: string;
    avatar: string;
  };
  amount: string;
  status: "Completed" | "Processing" | "Failed";
  gateway: string;
  date: string;
}

interface Props {
  payments: PaymentRow[];
}

const PaymentsTable: FC<Props> = ({ payments }) => {
  return (
    <div className="border border-[#E5E7EB] rounded-[10px] overflow-hidden bg-white">
      <table className="w-full text-[13px]">
        <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
          <tr className="text-[#6B7280] font-medium">
            <th className="px-[16px] py-[12px] text-left">
              Transaction ID
            </th>
            <th className="px-[16px] py-[12px] text-left">
              User
            </th>
            <th className="px-[16px] py-[12px] text-left">
              Amount
            </th>
            <th className="px-[16px] py-[12px] text-left">
              Status
            </th>
            <th className="px-[16px] py-[12px] text-left">
              Gateway
            </th>
            <th className="px-[16px] py-[12px] text-left">
              Date
            </th>
            <th className="px-[16px] py-[12px] text-left">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {payments.map((p) => (
            <tr
              key={p.transactionId}
              className="border-b border-[#E5E7EB] last:border-b-0"
            >
              <td className="px-[16px] py-[14px] font-medium text-[#111827]">
                #{p.transactionId}
              </td>

              <td className="px-[16px] py-[14px]">
                <div className="flex items-center gap-[10px]">
                  <img
                    src={p.user.avatar}
                    alt={p.user.name}
                    className="w-[32px] h-[32px] rounded-full"
                  />
                  <span className="text-[#111827]">
                    {p.user.name}
                  </span>
                </div>
              </td>

              <td className="px-[16px] py-[14px] font-medium text-[#111827]">
                {p.amount}
              </td>

              <td className="px-[16px] py-[14px]">
                <StatusBadge status={p.status} />
              </td>

              <td className="px-[16px] py-[14px] text-[#374151]">
                {p.gateway}
              </td>

              <td className="px-[16px] py-[14px] text-[#374151]">
                {p.date}
              </td>

              <td className="px-[16px] py-[14px]">
                <div className="flex items-center gap-[12px] text-[#6B7280]">
                  <Eye size={16} />
                  <MoreHorizontal size={16} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentsTable;
