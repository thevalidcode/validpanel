import React, { type JSX } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
  HomeIcon,
  BellIcon,
  ShoppingBagIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

import { Key, Percent, Settings, User, UsersIcon } from "lucide-react";

import { FaRegGem, FaShoppingCart, FaUsers } from "react-icons/fa";
import { MdPayment } from "react-icons/md";

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
      },
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
        name: "Reseller Stores",
        to: "/admin/reseller-stores",
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
        name: "Orders",
        to: "/admin/orders",
        icon: <ShoppingBagIcon className="w-5 h-5" />,
      },
      {
        name: "Payments",
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
    title: "Platform Settings",
    items: [
      {
        name: "Subscription Plans",
        to: "/admin/subscription-plans",
        icon: <FaRegGem className="w-5 h-5" />,
      },

      {
        name: "Coupons",
        to: "/admin/coupons",
        icon: <Percent className="w-5 h-5" />,
      },
      {
        name: "Permissions",
        to: "/admin/permissions",
        icon: <Key className="w-5 h-5" />,
      },
    ],
  },
  {
    title: "Customer Support",
    items: [
      {
        name: "Contact Messages",
        to: "/admin/contact-messages",
        icon: <EnvelopeIcon className="w-5 h-5" />,
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
    <aside className="flex flex-col w-64 h-screen bg-white border-r border-gray-200 font-sans z-10 flex-shrink-0">
      {/* Logo Section - Fixed Height to match Header */}
      <div className="flex-shrink-0 h-[72px] px-6 flex items-center border-b border-gray-200 bg-white">
        <Link to="/admin/overview" className="block">
          <img
            src="/Valid2.svg"
            alt="ValidPanel Logo"
            className="h-9 w-auto object-contain transition-transform hover:scale-105"
          />
        </Link>
      </div>

      {/* Navigation - Scrollable area */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        <nav className="space-y-6">
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="px-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                {section.title}
              </h3>

              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const active = isActive(item.to);

                  return (
                    <Link
                      key={item.name}
                      to={item.to}
                      onClick={handleNavClick}
                      className={`group flex items-center gap-3 px-3 py-2.5 rounded-[4px] transition-all duration-200 text-sm font-medium
                        ${
                          active
                            ? "bg-purple-600 text-white shadow-sm"
                            : "text-gray-600 hover:bg-purple-50 hover:text-purple-700"
                        }`}
                    >
                      <span
                        className={`transition-colors ${
                          active
                            ? "text-white"
                            : "text-gray-400 group-hover:text-purple-600"
                        }`}
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

      {/* User Profile Section - Pinned Bottom */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white">
        <div className="relative">
          <AnimatePresence>
            {openProfile && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-full left-0 mb-3 w-full bg-white border border-gray-200 rounded-[4px] shadow-xl shadow-gray-200/50 p-1.5 z-50 overflow-hidden ring-1 ring-black/5"
              >
                <div className="flex flex-col gap-1">
                  <Link
                    to="/admin/account"
                    className="flex items-center gap-3 px-3 py-2 rounded-[4px] text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition text-sm font-medium"
                  >
                    <User className="h-4 w-4 text-gray-500" />
                    Profile
                  </Link>
                  <Link
                    to="/admin/settings"
                    className="flex items-center gap-3 px-3 py-2 rounded-[4px] text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition text-sm font-medium"
                  >
                    <Settings className="h-4 w-4 text-gray-500" />
                    Settings
                  </Link>
                  <div className="h-px bg-gray-100 my-1"></div>
                  <button
                    type="button"
                    onClick={onLogout}
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-[4px] text-red-600 hover:bg-red-50 transition text-sm font-medium"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                      />
                    </svg>
                    Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="button"
            onClick={() => setOpenProfile((prev) => !prev)}
            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-[4px] transition border border-transparent group
              ${
                openProfile
                  ? "bg-purple-50 border-purple-100"
                  : "hover:bg-gray-50 hover:border-gray-200"
              }
            `}
          >
            <img
              src={adminInfo?.image || "/Sarah.png"}
              alt="User"
              className="h-9 w-9 rounded-full object-cover border border-gray-100 shadow-sm group-hover:border-purple-200 transition-colors"
            />

            <div className="flex flex-col text-left overflow-hidden">
              <span className="text-sm font-semibold text-gray-900 truncate">
                {adminInfo?.fullName}
              </span>

              <span className="text-xs text-gray-500 truncate font-medium group-hover:text-purple-600 transition-colors">
                {adminInfo?.email}
              </span>
            </div>
          </button>
        </div>
      </div>
    </aside>
  );
}
