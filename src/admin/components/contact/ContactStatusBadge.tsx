import type { ContactMessageStatus } from "@/types";

interface ContactStatusBadgeProps {
  status: ContactMessageStatus;
}

const STATUS_COLORS: Record<
  ContactMessageStatus,
  { bg: string; text: string }
> = {
  PENDING: { bg: "bg-yellow-100", text: "text-yellow-700" },
  REPLIED: { bg: "bg-blue-100", text: "text-blue-700" },
  RESOLVED: { bg: "bg-green-100", text: "text-green-700" },
};

export default function ContactStatusBadge({
  status,
}: ContactStatusBadgeProps) {
  const colors = STATUS_COLORS[status];

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}
    >
      {status}
    </span>
  );
}
