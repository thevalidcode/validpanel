import type { FC } from "react";

export type StatusType = "Pending" | "Completed" | "Failed" | "Processing";

interface StatusBadgeProps {
  status: StatusType;
}

const STATUS_STYLES: Record<
  StatusType,
  {
    bg: string;
    text: string;
  }
> = {
  Pending: {
    bg: "bg-[#FFF7ED]",      // soft orange
    text: "text-[#C2410C]",
  },
  Completed: {
    bg: "bg-[#ECFDF3]",      // soft green
    text: "text-[#027A48]",
  },
  Failed: {
    bg: "bg-[#FEF3F2]",      // soft red
    text: "text-[#B42318]",
  },
  Processing: {
    bg: "bg-[#EEF4FF]",      // soft blue (used on desktop)
    text: "text-[#3538CD]",
  },
};

const StatusBadge: FC<StatusBadgeProps> = ({ status }) => {
  const styles = STATUS_STYLES[status];

  return (
    <span
      className={`
        inline-flex
        items-center
        justify-center
        h-[20px]
        px-[8px]
        rounded-[6px]
        text-[11px]
        font-medium
        leading-[1]
        ${styles.bg}
        ${styles.text}
      `}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
