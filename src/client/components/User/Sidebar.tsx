import type { FC, ReactElement } from "react";
import {
  HomeIcon,
  UsersIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";

// Define the structure for each menu item
interface MenuItem {
  name: string;
  icon: ReactElement;
  active?: boolean;
}

// Define component type
const Sidebar: FC = () => {
  const menuItems: MenuItem[] = [
    { name: "Overview", icon: <HomeIcon className="w-5 h-5" /> },
    { name: "Users", icon: <UsersIcon className="w-5 h-5" /> },
    {
      name: "Stores",
      icon: <ShoppingBagIcon className="w-5 h-5" />,
      active: true,
    },
    { name: "Analytics", icon: <ChartBarIcon className="w-5 h-5" /> },
    { name: "Settings", icon: <Cog6ToothIcon className="w-5 h-5" /> },
  ];

  return (
    <aside className="w-60 bg-white border-r border-gray-300 min-h-screen p-4">
      <h1 className="text-2xl font-bold text-purple-700 mb-8">ValidPanel</h1>
      <ul className="space-y-2">
        {menuItems.map((item) => (
          <li
            key={item.name}
            className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition ${
              item.active
                ? "bg-purple-50 text-purple-700 font-medium"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {item.icon}
            {item.name}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
