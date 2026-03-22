import Loader from "@/components/Loader";
import NotificationPopup from "@/components/NotificationPopup";
import { useAppContext } from "@/context/useAppContext";
import { useGetNotifications } from "@/hooks/use-notification";
import {
  BellIcon,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  User,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
interface HeaderProps {
  title: string;
  description: string;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Header = ({
  title,
  description,
  onToggleSidebar,
  isSidebarOpen,
}: HeaderProps) => {
  const [open, setOpen] = useState(false);
  const { data: notifications, isLoading: isNotificationsLoading } =
    useGetNotifications();

  const { adminInfo, handleSetAdminInfo } = useAppContext();
  const [openProfile, setOpenProfile] = useState(false);

  const onLogout = () => {
    handleSetAdminInfo(null);
  };
  if (isNotificationsLoading) {
    return <Loader />;
  }

  return (
    <header className="h-[72px] bg-white border-b border-gray-200 px-6 flex items-center justify-between relative font-sans flex-shrink-0 z-20">
      {/* Left Section (Sidebar Toggle + Title) */}
      <div className="flex items-center gap-6 min-w-0">
        {/* Sidebar Toggle Button */}
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-2 -ml-2 rounded-[4px] hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors hidden md:flex"
          title={isSidebarOpen ? "Hide sidebar" : "Show sidebar"}
        >
          {isSidebarOpen ? (
            <PanelLeftClose className="w-5 h-5" />
          ) : (
            <PanelLeftOpen className="w-5 h-5" />
          )}
        </button>

        {/* Title + Description */}
        <div className="min-w-0 flex flex-col justify-center">
          <h2 className="text-xl font-bold text-gray-900 truncate leading-tight">
            {title}
          </h2>
          {description && (
            <p className="text-gray-500 text-xs truncate mt-0.5 leading-tight">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Right Section: Profile + Notifications */}
      <div className="flex items-center gap-4 shrink-0">
        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            title="Notifications"
            onClick={() => setOpen(true)}
            className="p-2 rounded-full hover:bg-gray-100/80 text-gray-500 hover:text-gray-900 transition-colors relative"
          >
            <BellIcon className="w-5 h-5" />
            {notifications && notifications.length > 0 && (
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            )}
          </button>
          <NotificationPopup
            open={open}
            notifications={notifications || []}
            type="admin"
            onClose={() => setOpen(false)}
          />
        </div>

        <div className="h-8 w-px bg-gray-200 mx-1"></div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setOpenProfile((prev) => !prev)}
            className={`flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-[4px] transition border border-transparent
              ${
                openProfile
                  ? "bg-purple-50 border-purple-100 text-purple-900"
                  : "hover:bg-gray-50 hover:border-gray-200 text-gray-700"
              }
            `}
          >
            <div className="relative">
              <img
                src={adminInfo?.image || "/Sarah.png"}
                alt="profile"
                className="w-8 h-8 rounded-full object-cover border border-gray-200"
              />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            
            <div className="flex flex-col items-start text-left sm:flex">
              <p className="font-semibold text-sm leading-none mb-1">
                {adminInfo?.fullName?.split(" ")[0]}
              </p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wide font-medium leading-none">
                {adminInfo?.role.name || "Admin"}
              </p>
            </div>
          </button>

          <AnimatePresence>
            {openProfile && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-200 shadow-xl rounded-[4px] p-1.5 z-50 overflow-hidden ring-1 ring-black/5"
              >
                <div className="flex flex-col gap-1">
                  <div className="px-3 py-2 border-b border-gray-100 mb-1">
                    <p className="font-medium text-sm text-gray-900 truncate">
                      {adminInfo?.fullName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {adminInfo?.email}
                    </p>
                  </div>
                  <Link
                    to="/admin/account"
                    className="flex items-center gap-3 px-3 py-2 rounded-[4px] text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition text-sm font-medium"
                  >
                    <User className="h-4 w-4 text-gray-400 group-hover:text-purple-500" />
                    Profile
                  </Link>
                  <Link
                    to="/admin/settings"
                    className="flex items-center gap-3 px-3 py-2 rounded-[4px] text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition text-sm font-medium"
                  >
                    <Settings className="h-4 w-4 text-gray-400 group-hover:text-purple-500" />
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
        </div>
      </div>
    </header>
  );
};

export default Header;
