import React, { type JSX } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingBagIcon, HomeIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "@/context/useAppContext";
import {
  BookOpenIcon,
  CreditCard,
  MailIcon,
  TagIcon,
  User,
} from "lucide-react";

interface MenuItem {
  name: string;
  to: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

interface StoreSidebarProps {
  onNavClick?: () => void; // optional callback when a nav item is clicked
  isMobile?: boolean;
}

const menu: MenuItem[] = [
  { name: "Analytics", icon: HomeIcon, to: "/analytics" },
  { name: "Stores", icon: ShoppingBagIcon, to: "/stores" },
  { name: "Subscription", icon: CreditCard, to: "/subscription" },
  { name: "Knowledge Base", icon: BookOpenIcon, to: "/knowledge-base" },
  { name: "Pricing", icon: TagIcon, to: "/pricing" },
  { name: "Contact Us", icon: MailIcon, to: "/contact-us" },
];

export default function StoreSidebar({
  onNavClick,
  isMobile,
}: StoreSidebarProps): JSX.Element {
  const location = useLocation();
  const isActive = (path: string) => location.pathname.startsWith(path);
  const { userInfo, handleSetUserInfo } = useAppContext();

  const [openProfile, setOpenProfile] = React.useState(false);

  const onLogout = () => {
    handleSetUserInfo(null);
  };

  const handleNavClick = () => {
    if (isMobile && onNavClick) {
      onNavClick();
    }
  };

  return (
    <aside className="flex flex-col w-64 h-screen bg-white border-r border-gray-200 font-sans z-30 flex-shrink-0">
      {/* Logo Section - Fixed Height to match Header */}
      <div className="flex-shrink-0 h-[72px] px-6 flex items-center border-b border-gray-200 bg-white">
        <Link to="/analytics" className="block">
          <img
            src="/Valid2.svg"
            alt="ValidPanel Logo"
            className="h-9 w-auto object-contain transition-transform hover:scale-105"
          />
        </Link>
      </div>

      {/* Navigation - Scrollable area */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        <nav className="space-y-0.5">
          {menu.map((item) => {
            const active = isActive(item.to);
            return (
              <Link
                to={item.to}
                key={item.name}
                onClick={handleNavClick}
                className={`group flex items-center gap-3 w-full px-3 py-2.5 rounded-[4px] transition-all duration-200 font-medium text-sm
                ${
                  active
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-gray-600 hover:bg-purple-50 hover:text-purple-700"
                }`}
              >
                <item.icon
                  className={`h-5 w-5 transition-colors ${
                    active
                      ? "text-white"
                      : "text-gray-400 group-hover:text-purple-600"
                  }`}
                />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
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
                    to="/settings"
                    className="flex items-center gap-3 px-3 py-2 rounded-[4px] text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition text-sm font-medium"
                  >
                    <User className="h-4 w-4 text-gray-500" />
                    Profile
                  </Link>

                  <div className="h-px bg-gray-100 my-1"></div>

                  <button
                    type="button"
                    onClick={onLogout}
                    className="flex items-center gap-3 px-3 py-2 w-full rounded-[4px] text-red-600 hover:bg-red-50 transition text-sm font-medium"
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
              src={userInfo?.image || "/Sarah.png"}
              alt="User"
              className="h-9 w-9 rounded-full object-cover border border-gray-100 shadow-sm group-hover:border-purple-200 transition-colors"
            />
            <div className="flex flex-col text-left w-40 overflow-hidden">
              <span className="text-sm font-semibold truncate text-gray-900">
                {userInfo?.fullName}
              </span>

              <span className="text-xs text-gray-500 truncate font-medium group-hover:text-purple-600 transition-colors">
                {userInfo?.email}
              </span>
            </div>
          </button>
        </div>
      </div>
    </aside>
  );
}
