import { useAppContext } from "@/context/useAppContext";
import { BellIcon, PanelLeftClose, PanelLeftOpen, User } from "lucide-react";
import { useGetUserActiveSubscription } from "@/hooks/use-subscription";
import Loader from "@/components/Loader";
import NotificationPopup from "@/components/NotificationPopup";
import { useState } from "react";
import {
  useGetUserNotifications,
  useGetUserUnreadNotificationCount,
} from "@/hooks/use-notification";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";

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
  const { userInfo, handleSetUserInfo } = useAppContext();
  const { data: subscription, isLoading } = useGetUserActiveSubscription();
  const [open, setOpen] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const { data: notifications, isLoading: isNotificationsLoading } =
    useGetUserNotifications();

  const { data: unreadCount, isLoading: isUnreadLoading } =
    useGetUserUnreadNotificationCount();

  if (isLoading || isNotificationsLoading || isUnreadLoading) {
    return <Loader />;
  }

  const onLogout = () => {
    handleSetUserInfo(null);
  };

  return (
    <header className="bg-white border-b border-gray-200 px-5 py-4 flex items-center justify-between relative">
      {/* Left */}
      <div className="flex items-center gap-4 min-w-0">
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

        <div className="min-w-0">
          <h2 className="text-2xl font-bold truncate">{title}</h2>
          <p className="text-gray-500 text-sm truncate">{description}</p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-6 shrink-0">
        {/* Profile */}
        <div className="relative">
          <div
            className="flex items-center cursor-pointer gap-3 w-full px-3 py-2 rounded-lg text-gray-700 hover:bg-purple-100 hover:text-primary transition max-w-[180px] overflow-hidden"
            onClick={() => setOpenProfile((prev) => !prev)}
          >
            <img
              src={userInfo?.image || "/Sarah.png"}
              alt="profile"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex flex-col">
              <p className="font-medium text-sm text-gray-700 truncate">
                {userInfo?.fullName}
              </p>
              <p className="tracking-wide uppercase text-xs text-gray-500 truncate">
                {subscription?.plan.name ?? "Free Plan"}
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
                className="absolute -bottom-23 left-0 w-full bg-white shadow-lg border border-gray-200 rounded-xl p-2"
              >
                <Link
                  to="/settings"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-purple-100 hover:text-primary transition text-sm"
                >
                  <User className="h-5 w-5 text-gray-500" />
                  Profile
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

        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            title="Notifications"
            onClick={() => setOpen(!open)}
            className="p-2 rounded-full hover:bg-gray-100 relative"
          >
            <BellIcon className="w-6 h-6 text-gray-600" />
            {unreadCount && unreadCount > 0 ? (
              <div className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-600 rounded-full">
                {unreadCount}
              </div>
            ) : (
              ""
            )}
          </button>

          <NotificationPopup
            open={open}
            notifications={notifications || []}
            type="user"
            onClose={() => setOpen(false)}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
