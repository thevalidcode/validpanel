import type { FC } from "react";
import {
  HomeIcon,
  BellIcon,
  ShoppingBagIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router-dom";
import { ChartSpline, Key, Settings, UsersIcon } from "lucide-react";
import { FaShoppingCart, FaUsers } from "react-icons/fa";
import { MdApi, MdPayment } from "react-icons/md";

// Define the structure for each menu item
// interface MenuItem {
//   name: string;
//   icon: ReactElement;
//   route: string;
// }

const dashboard = [
  {
    name: "Overview",
    route: "/admin/overview",
    icon: <HomeIcon className="w-5 h-5" />,
  },
  {
    name: "Notifications",
    route: "/admin/notifications",
    icon: <BellIcon className="w-5 h-5" />,
  },
  {
    name: "Analytics",
    route: "/admin/analytics",
    icon: <ChartSpline className="w-5 h-5" />,
  },
];
const users = [
  {
    name: "Overview",
    route: "/overview",
    icon: <HomeIcon className="w-5 h-5" />,
  },
  { name: "Users", route: "/users", icon: <UsersIcon className="w-5 h-5" /> },
  {
    name: "Notifications",
    route: "/notifications",
    icon: <BellIcon className="w-5 h-5" />,
  },
  {
    name: "Stores",
    route: "/stores",
    icon: <ShoppingBagIcon className="w-5 h-5" />,
  },
  {
    name: "Settings",
    route: "/settings",
    icon: <Cog6ToothIcon className="w-5 h-5" />,
  },
];

const usersAndStores = [
  {
    name: "Users",
    route: "/admin/users",
    icon: <UsersIcon className="w-5 h-5" />,
  },
  {
    name: "Stores",
    route: "/admin/stores",
    icon: <ShoppingBagIcon className="w-5 h-5" />,
  },
  {
    name: "Admin Management",
    route: "/admin/admin-management",
    icon: <FaUsers className="w-5 h-5" />,
  },
];
const ordersAndPayments = [
  {
    name: "Orders Management",
    route: "/admin/orders",
    icon: <ShoppingBagIcon className="w-5 h-5" />,
  },
  {
    name: "Payments & Transactions",
    route: "/admin/payments",
    icon: <FaShoppingCart className="w-5 h-5" />,
  },
  {
    name: "Payment Gateways",
    route: "/admin/payment-gateways",
    icon: <MdPayment className="w-5 h-5" />,
  },
];
const systemSettings = [
  {
    name: "API Providers",
    route: "/admin/api-providers",
    icon: <MdApi className="w-5 h-5" />,
  },
  {
    name: "Permissions",
    route: "/admin/permissions",
    icon: <Key className="w-5 h-5" />,
  },
  {
    name: "Settings",
    route: "/admin/settings",
    icon: <Settings className="w-5 h-5" />,
  },
];

interface SidebarProps {
  role?: "admin" | "user";
}
// Define component type
const Sidebar: FC<SidebarProps> = ({ role = "user" }) => {
  const { pathname } = useLocation();

  return (
    <aside className="w-66.5 bg-white border-r border-gray-300 p-4 overflow-y-scroll h-screen hide-scrollbar">
      <h1 className="text-2xl font-bold text-purple-700 mb-8">ValidPanel</h1>
      {role === "admin" ? (
        <div className="flex flex-col gap-5">
          <div className="space-y-2">
            <h2 className="font-medium text-lg ">Overview</h2>
            <div className="space-y-1">
              {dashboard.map((item) => (
                <Link
                  to={`${item.route.toLowerCase()}`}
                  key={item.name}
                  className={`flex items-center gap-1 pl-1 py-1 rounded-md cursor-pointer transition ${
                    item.route === pathname
                      ? "bg-purple-50 text-purple-700 font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="space-y-2 ">
            <h2 className="font-medium text-lg ">User & Store Managment</h2>
            <div className="space-y-1">
              {usersAndStores.map((item) => (
                <Link
                  to={`${item.route.toLowerCase()}`}
                  key={item.name}
                  className={`flex items-center gap-1 pl-1 py-1 rounded-md cursor-pointer transition ${
                    item.route === pathname
                      ? "bg-purple-50 text-purple-700 font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="space-y-2 ">
            <h2 className="font-medium text-lg ">Orders & Payments</h2>
            <div className="space-y-1">
              {ordersAndPayments.map((item) => (
                <Link
                  to={`${item.route.toLowerCase()}`}
                  key={item.name}
                  className={`flex items-center gap-1 pl-1 py-1 rounded-md cursor-pointer transition ${
                    item.route === pathname
                      ? "bg-purple-50 text-purple-700 font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="space-y-2 ">
            <h2 className="font-medium text-lg ">System Settings</h2>
            <div className="space-y-1">
              {systemSettings.map((item) => (
                <Link
                  to={`${item.route.toLowerCase()}`}
                  key={item.name}
                  className={`flex items-center gap-1 pl-1 py-1 rounded-md cursor-pointer transition ${
                    item.route === pathname
                      ? "bg-purple-50 text-purple-700 font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-1">
          {users.map((item) => (
            <Link
              to={`${item.name.toLowerCase()}`}
              key={item.name}
              className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition ${
                item.route === pathname
                  ? "bg-purple-50 text-purple-700 font-medium"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
