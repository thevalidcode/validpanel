import type { SubscriptionPlanInterval } from "@/types";

interface SubscriptionItemProps {
  planName: string;
  billingCycle: SubscriptionPlanInterval;
  subscribers: number;
  revenue: string;
  logoUrl?: string;
  isTrending?: boolean;
}

export const SubscriptionItem: React.FC<SubscriptionItemProps> = ({
  planName,
  billingCycle,
  subscribers,
  revenue,
  logoUrl,
  isTrending = false,
}) => {
  const initials = planName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <li className="flex justify-between items-center py-2">
      <div className="flex items-center gap-3">
        {logoUrl ? (
          <img
            src={logoUrl}
            className="w-10 h-10 rounded-md object-cover"
            alt={planName}
          />
        ) : (
          <div className="w-10 h-10 rounded-md bg-purple-100 text-purple-700 flex items-center justify-center text-sm font-semibold">
            {initials}
          </div>
        )}

        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium text-gray-800 text-sm">{planName}</p>
            {isTrending && (
              <span className="text-[10px] px-2 py-[2px] rounded-full bg-green-100 text-green-700 font-semibold">
                Trending
              </span>
            )}
          </div>

          <p className="text-xs text-gray-500">
            {billingCycle} • {subscribers.toLocaleString()} subscribers
          </p>
        </div>
      </div>

      <div className="text-right">
        <p className="text-gray-900 font-semibold text-sm">{revenue}</p>
        <p className="text-xs text-gray-400">MRR</p>
      </div>
    </li>
  );
};
