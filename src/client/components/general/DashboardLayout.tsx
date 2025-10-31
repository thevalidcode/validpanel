import { useState, type FC, type ReactNode } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Sidebar from "../User/Sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
  role?: "admin" | "user";
}

const DashboardLayout: FC<DashboardLayoutProps> = ({ children, role }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className=" flex flex-col md:flex-row bg-gray-50 w-full">
      <div className="md:hidden sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-white border-b">
        <h1 className="text-xl font-bold text-purple-700">ValidPanel</h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-600 hover:text-gray-800"
        >
          {sidebarOpen ? (
            <XMarkIcon className="w-6 h-6" />
          ) : (
            <Bars3Icon className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full bg-white border-r w-66.5 z-40 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0 " : "-translate-x-full md:translate-x-0"}
        `}
      >
        <Sidebar role={role} />
      </aside>

      {/* Overlay (for mobile sidebar) */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-gray-100 opacity-80 md:hidden"
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full overflow-y-scroll h-screen hide-scrollbar">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
