import React, { type JSX } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
  HomeIcon,
  BellIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";

import { Key, Settings, UsersIcon } from "lucide-react";

import { FaShoppingCart, FaUsers } from "react-icons/fa";
import { MdApi, MdPayment } from "react-icons/md";

import { useAppContext } from "@/context/useAppContext";

interface MenuItem {
  name: string;
  to: string;
  icon: JSX.Element;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

const sections: MenuSection[] = [
  {
    title: "Overview",
    items: [
      {
        name: "Overview",
        to: "/admin/overview",
        icon: <HomeIcon className="w-5 h-5" />,
      },
      {
        name: "Notifications",
        to: "/admin/notifications",
        icon: <BellIcon className="w-5 h-5" />,
      }
    ],
  },
  {
    title: "Users & Stores",
    items: [
      {
        name: "Users",
        to: "/admin/users",
        icon: <UsersIcon className="w-5 h-5" />,
      },
      {
        name: "Stores",
        to: "/admin/stores",
        icon: <ShoppingBagIcon className="w-5 h-5" />,
      },
      {
        name: "Admin Management",
        to: "/admin/admin-management",
        icon: <FaUsers className="w-5 h-5" />,
      },
    ],
  },
  {
    title: "Orders & Payments",
    items: [
      {
        name: "Orders Management",
        to: "/admin/orders",
        icon: <ShoppingBagIcon className="w-5 h-5" />,
      },
      {
        name: "Payments & Transactions",
        to: "/admin/payments",
        icon: <FaShoppingCart className="w-5 h-5" />,
      },
      {
        name: "Payment Gateways",
        to: "/admin/payment-gateways",
        icon: <MdPayment className="w-5 h-5" />,
      },
    ],
  },
  {
    title: "System Settings",
    items: [
      {
        name: "API Providers",
        to: "/admin/api-providers",
        icon: <MdApi className="w-5 h-5" />,
      },
      {
        name: "Permissions",
        to: "/admin/permissions",
        icon: <Key className="w-5 h-5" />,
      },
      {
        name: "Settings",
        to: "/admin/settings",
        icon: <Settings className="w-5 h-5" />,
      },
    ],
  },
];

interface SidebarProps {
  onNavClick?: () => void; // optional callback when a nav item is clicked
  isMobile?: boolean;
}

export default function AdminSidebar({
  onNavClick,
  isMobile,
}: SidebarProps): JSX.Element {
  const location = useLocation();
  const isActive = (path: string) => location.pathname.startsWith(path);

  const { adminInfo, handleSetAdminInfo } = useAppContext();
  const [openProfile, setOpenProfile] = React.useState(false);

  const onLogout = () => {
    handleSetAdminInfo(null);
  };
  const handleNavClick = () => {
    if (isMobile && onNavClick) {
      onNavClick();
    }
  };
  return (
    <aside className="flex flex-col justify-between w-64 h-screen border-r border-gray-200 bg-white px-5 py-4 shadow-sm flex-1 overflow-y-auto">
      {/* Logo */}
      <div>
        <Link
          to="/admin/overview"
          className="flex items-center justify-center mb-8"
        >
          <img
            src="/Valid2.svg"
            alt="ValidPanel Logo"
            className="h-14 object-contain"
          />
        </Link>

        {/* Menu Sections */}
        <nav className="space-y-6">
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-gray-500 mb-1">
                {section.title}
              </h3>

              <div className="space-y-1">
                {section.items.map((item) => {
                  const active = isActive(item.to);

                  return (
                    <Link
                      key={item.name}
                      to={item.to}
                      onClick={handleNavClick}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition text-sm font-medium
                        ${
                          active
                            ? "bg-purple-600 text-white"
                            : "text-gray-700 hover:bg-purple-100 hover:text-primary"
                        }`}
                    >
                      <span
                        className={`${active ? "text-white" : "text-gray-500"}`}
                      >
                        {item.icon}
                      </span>
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* User Profile Section */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpenProfile((prev) => !prev)}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-gray-700 hover:bg-purple-100 transition"
        >
          <img
            src={adminInfo?.image || "/Sarah.png"}
            alt="User"
            className="h-9 w-9 rounded-full object-cover"
          />

          <div className="flex flex-col w-40 text-left">
            <span className="text-sm font-semibold truncate">
              {adminInfo?.fullName}
            </span>

            <span className="text-xs text-gray-500 truncate">
              {adminInfo?.email}
            </span>
          </div>
        </button>

        <AnimatePresence>
          {openProfile && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-14 left-0 w-full bg-white border border-gray-200 shadow-lg rounded-xl p-2"
            >
              <Link
                to="/admin/settings"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-purple-100 transition text-sm"
              >
                <Settings className="h-5 w-5 text-gray-500" />
                Settings
              </Link>

              <button
                type="button"
                onClick={onLogout}
                className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-red-600 hover:bg-red-100 transition text-sm"
              >
                Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  );
}
