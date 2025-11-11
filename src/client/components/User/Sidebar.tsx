import React from "react";
import {
  HomeIcon,
  BellIcon,
  ChartBarIcon,
  UserGroupIcon,
  BuildingStorefrontIcon,
  UserIcon,
  ShoppingBagIcon,
  CreditCardIcon,
  CurrencyDollarIcon,
  Cog6ToothIcon,
  KeyIcon,
} from "@heroicons/react/24/outline";

type MenuItem = {
  name: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  active?: boolean;
};

type MenuSection = {
  title: string;
  items: MenuItem[];
};

const Sidebar: React.FC = () => {
  const menuSections: MenuSection[] = [
    {
      title: "Dashboard",
      items: [
        { name: "Overview", icon: HomeIcon },
        { name: "Notifications", icon: BellIcon },
        { name: "Analytics", icon: ChartBarIcon },
      ],
    },
    {
      title: "User & Store Management",
      items: [
        { name: "Users", icon: UserGroupIcon },
        { name: "Stores", icon: BuildingStorefrontIcon },
        { name: "Admin Management", icon: UserIcon },
      ],
    },
    {
      title: "Orders & Payments",
      items: [
        { name: "Orders Management", icon: ShoppingBagIcon },
        { name: "Payments", icon: CreditCardIcon },
        { name: "Payment Gateways", icon: CurrencyDollarIcon },
      ],
    },
    {
      title: "System Settings",
      items: [
        { name: "API Providers", icon: Cog6ToothIcon },
        { name: "Permissions", icon: KeyIcon },
        { name: "Settings", icon: Cog6ToothIcon, active: true },
      ],
    },
  ];

  return (
    <aside className="md:flex flex-col w-64 h-screen bg-white border-r p-5">
      {/* Logo */}
      <div className="flex items-center">
        <img src="Valid2.svg" alt="ValidPanel Logo" className="mt-0" />
      </div>

      {/* Menu Sections */}
      <nav className="flex-1 space-y-6">
        {menuSections.map((section) => (
          <div key={section.title}>
            <h2 className="text-xs font-semibold uppercase mb-2">
              {section.title}
            </h2>
            <div className="space-y-1">
              {section.items.map((item) => (
                <button
                  key={item.name}
                  className={`flex items-center w-full gap-3 py-2 rounded-lg text-sm font-semibold text-black transition ${
                    item.active
                      ? "bg-purple-50 text-purple-700 font-medium"
                      : "text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                  }`}
                >
                  <item.icon
                    className={`h-5 w-5 ${
                      item.active ? "text-purple-700" : "text-gray-500"
                    }`}
                  />
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
