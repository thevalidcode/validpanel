import { useAppContext } from "@/context/useAppContext";
import { BellIcon, PanelLeftClose, PanelLeftOpen } from "lucide-react";

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
  const { adminInfo } = useAppContext();

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
        <div className="flex items-center gap-2 max-w-[180px] overflow-hidden">
          <img
            src={adminInfo?.image || "/Sarah.png"}
            alt="profile"
            className="w-10 h-10 rounded-full object-cover"
          />
          <p className="font-medium text-sm text-gray-700 truncate">
            {adminInfo?.fullName}
          </p>
        </div>

        {/* Notifications */}
        <button
          type="button"
          title="Notifications"
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <BellIcon className="w-6 h-6 text-gray-600" />
        </button>
      </div>
    </header>
  );
};

export default Header;
