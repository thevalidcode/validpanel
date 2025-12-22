import React, { type JSX } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Cog6ToothIcon,
  ShoppingBagIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "@/context/useAppContext";
import { CreditCard, Settings } from "lucide-react";

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
  { name: "Settings", icon: Settings, to: "/settings" },
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
    <aside className="flex flex-col justify-between w-64 h-screen border-r border-gray-200 bg-white px-5 py-4 shadow-sm flex-1 overflow-y-auto">
      <div>
        <Link to="/analytics" className="flex items-center justify-center mb-6">
          <img
            src="/Valid2.svg"
            alt="ValidPanel Logo"
            className="h-14 object-contain"
          />
        </Link>

        <nav className="space-y-2">
          {menu.map((item) => {
            const active = isActive(item.to);
            return (
              <Link
                to={item.to}
                key={item.name}
                onClick={handleNavClick}
                className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg transition font-medium text-sm
                ${
                  active
                    ? "bg-purple-600 text-white"
                    : "text-gray-700 hover:bg-purple-100 hover:text-primary"
                }`}
              >
                <item.icon
                  className={`h-5 w-5 ${
                    active ? "text-white" : "text-gray-500"
                  }`}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpenProfile((prev) => !prev)}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-gray-700 hover:bg-purple-100 hover:text-primary transition"
        >
          <img
            src={userInfo?.image || "Sarah.png"}
            alt="User"
            className="h-9 w-9 rounded-full object-cover"
          />
          <div className="flex flex-col text-left w-40">
            <span className="text-sm font-semibold truncate">
              {userInfo?.fullName}
            </span>

            <span className="text-xs text-gray-500 truncate">
              {userInfo?.email}
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
              className="absolute bottom-14 left-0 w-full bg-white shadow-lg border border-gray-200 rounded-xl p-2"
            >
              <Link
                to="/settings"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-purple-100 hover:text-primary transition text-sm"
              >
                <Cog6ToothIcon className="h-5 w-5 text-gray-500" />
                Settings
              </Link>

              <button
                type="button"
                onClick={onLogout}
                className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-red-600 hover:bg-red-100 transition text-sm"
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
