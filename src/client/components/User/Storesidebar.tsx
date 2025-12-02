import React, { type JSX } from "react";
import {
  Cog6ToothIcon,
  UserGroupIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";

interface MenuItem {
  name: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const menu: MenuItem[] = [
  { name: "Overview", icon: HomeIcon },
  { name: "Users", icon: UserGroupIcon },
  { name: "Stores", icon: ShoppingBagIcon },
  { name: "Orders & Payments", icon: CurrencyDollarIcon },
  { name: "Settings", icon: Cog6ToothIcon },
];

export default function StoreSidebar(): JSX.Element {
  return (
    <aside className="md:block w-64 h-screen border-r bg-white px-5">
      <img src="Valid2.svg" alt="ValidPanel Logo" className="m-0" />
      <nav className="space-y-2">
        {menu.map((item) => (
          <button
            key={item.name}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-gray-700 hover:bg-purple-100 hover:text-purple-700 transition"
          >
            <item.icon className="h-5 w-5 text-gray-500" />
            <span className="text-sm font-medium">{item.name}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
