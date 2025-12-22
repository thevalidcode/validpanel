import { useAppContext } from "@/context/useAppContext";
import { BellIcon, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useGetUserActiveSubscription } from "@/hooks/use-subscription";
import Loader from "@/components/Loader";
import NotificationPopup from "@/components/NotificationPopup";
import { useState } from "react";
import {
  useGetUserNotifications,
  useGetUserUnreadNotificationCount,
} from "@/hooks/use-notification";

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
  const { userInfo } = useAppContext();
  const { data: subscription, isLoading } = useGetUserActiveSubscription();
  const [open, setOpen] = useState(false);
  const { data: notifications, isLoading: isNotificationsLoading } =
    useGetUserNotifications();

  const { data: unreadCount, isLoading: isUnreadLoading } =
    useGetUserUnreadNotificationCount();

  if (isLoading || isNotificationsLoading || isUnreadLoading) {
    return <Loader />;
  }

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
        <div className="flex items-center gap-2 max-w-[180px] overflow-hidden">
          <img
            src={userInfo?.image || "Sarah.png"}
            alt="profile"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <p className="font-medium text-sm text-gray-700 truncate">
              {userInfo?.fullName}
            </p>
            <p className="tracking-wide uppercase text-xs text-gray-500 truncate">
              {subscription?.plan.name || "Free Plan"}
            </p>
          </div>
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
