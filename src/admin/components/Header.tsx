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
    <header className="bg-white border-b border-gray-200 px-5 py-4 flex items-center justify-between relative">
      {/* Left Section (Sidebar Toggle + Title) */}
      <div className="flex items-center gap-4 min-w-0">
        {/* Sidebar Toggle Button */}
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-700 hidden md:flex"
          title={isSidebarOpen ? "Hide sidebar" : "Show sidebar"}
        >
          {isSidebarOpen ? (
            <PanelLeftClose className="w-6 h-6" />
          ) : (
            <PanelLeftOpen className="w-6 h-6" />
          )}
        </button>

        {/* Title + Description */}
        <div className="min-w-0">
          <h2 className="text-2xl font-bold truncate">{title}</h2>
          <p className="text-gray-500 text-sm truncate">{description}</p>
        </div>
      </div>

      {/* Right Section: Profile + Notifications */}
      <div className="flex items-center gap-8 shrink-0">
        {/* Profile */}
        <div className="relative">
          <div
            onClick={() => setOpenProfile((prev) => !prev)}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-gray-700 hover:bg-purple-100 transition max-w-[180px] overflow-hidden cursor-pointer"
          >
            <img
              src={adminInfo?.image || "/Sarah.png"}
              alt="profile"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex flex-col">
              <p className="font-medium text-sm text-gray-700 truncate">
                {adminInfo?.fullName}
              </p>
              <p className="tracking-wide uppercase text-xs text-gray-500 truncate">
                {adminInfo?.role.name || "Administrator"}
              </p>
            </div>
          </div>
          <AnimatePresence>
            {openProfile && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.15 }}
                className="absolute -bottom-32 left-0 w-full bg-white border border-gray-200 shadow-lg rounded-xl p-2"
              >
                <div className="flex flex-col">
                  <Link
                    to="/admin/account"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-purple-100 transition text-sm"
                  >
                    <User className="h-5 w-5 text-gray-500" />
                    Profile
                  </Link>
                  <Link
                    to="/admin/settings"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-purple-100 transition text-sm"
                  >
                    <Settings className="h-5 w-5 text-gray-500" />
                    Settings
                  </Link>
                </div>
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

        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            title="Notifications"
            onClick={() => setOpen(true)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <BellIcon className="w-6 h-6 text-gray-600" />
          </button>
          <NotificationPopup
            open={open}
            notifications={notifications || []}
            type="admin"
            onClose={() => setOpen(false)}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
