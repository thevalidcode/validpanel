import { Laptop, Store, UtensilsCrossed } from "lucide-react";
import type { FC, ReactNode } from "react";

interface RecentStore {
  id: number;
  name: string;
  icon: ReactNode;
  bgColor: string;
  created: string;
  revenue: number;
}

const recentStores: RecentStore[] = [
  {
    id: 1,
    name: "Fashion Hub",
    icon: <Store size={20} className="text-purple-600" />,
    bgColor: "bg-purple-100",
    created: "2 hours ago",
    revenue: 156,
  },
  {
    id: 2,
    name: "Food Corner",
    icon: <UtensilsCrossed size={20} className="text-orange-600" />,
    bgColor: "bg-orange-100",
    created: "5 hours ago",
    revenue: 89,
  },
  {
    id: 3,
    name: "Tech Store",
    icon: <Laptop size={20} className="text-indigo-600" />,
    bgColor: "bg-indigo-100",
    created: "1 day ago",
    revenue: 324,
  },
];

const RecentStoreItem: FC<RecentStore> = ({
  icon,
  bgColor,
  name,
  created,
  revenue,
}) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-lg ${bgColor}`}>{icon}</div>
      <div>
        <p className="font-semibold text-gray-800">{name}</p>
        <p className="text-xs text-gray-500">{`Created ${created}`}</p>
      </div>
    </div>
    <div className="text-right">
      <p className="font-bold text-purple-600">${revenue}</p>
      <p className="text-xs text-gray-500">Revenue</p>
    </div>
  </div>
);

const RecentStores = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">
        Recent Stores
      </h2>
      <div>
        {recentStores.map((store) => (
          <RecentStoreItem key={store.id} {...store} />
        ))}
      </div>
    </div>
  );
};

export default RecentStores;
