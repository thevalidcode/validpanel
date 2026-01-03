import type { FC, ReactNode } from "react";

interface Props {
  title: string;
  value: string;
  icon: ReactNode;
  iconBg: string;
}

const PaymentSummaryCard: FC<Props> = ({
  title,
  value,
  icon,
  iconBg,
}) => {
  return (
    <div className="border border-[#E5E7EB] rounded-[10px] px-[16px] py-[14px] flex items-center justify-between bg-white">
      <div>
        <p className="text-[12px] text-[#6B7280] leading-[16px]">
          {title}
        </p>
        <p className="mt-[4px] text-[18px] font-semibold text-[#111827]">
          {value}
        </p>
      </div>

      <div
        className={`w-[36px] h-[36px] rounded-full flex items-center justify-center ${iconBg}`}
      >
        {icon}
      </div>
    </div>
  );
};

export default PaymentSummaryCard;
