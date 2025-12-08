import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import StoreSidebar from "./StoreSidebar";
import { useAppContext } from "@/context/useAppContext";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

function Layout({
  children,
  title,
  description,
}: {
  children: React.ReactNode;
  title?: string;
  description?: string;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    // Get initial value from localStorage, default to false
    const saved = localStorage.getItem("sidebarOpen");
    return saved ? JSON.parse(saved) : false;
  });

  const { userInfo, isAuthLoading } = useAppContext();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isAuthLoading && !userInfo) {
      navigate("/");
    }
  }, [isAuthLoading, userInfo, navigate]);

  useEffect(() => {
    if (title) {
      document.title = `${title} | Valid Panel`;
    }
  }, [title]);

  // Save sidebar state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-gray-200 bg-white border-b">
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
        className={`fixed top-0 left-0 h-full bg-white border-r border-gray-100 z-80
  transform transition-transform duration-300 ease-in-out overflow-hidden
  ${sidebarOpen ? "translate-x-0 w-60" : "-translate-x-[100%] w-0"}`}
      >
        <StoreSidebar />
      </aside>

      {/* Overlay (for mobile sidebar) */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-gray-100 opacity-80 md:hidden"
        ></div>
      )}

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col ${
          isMobile ? "" : sidebarOpen ? "ml-60 " : ""
        }`}
      >
        {title && description && (
          <Header
            title={title}
            description={description}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            isSidebarOpen={sidebarOpen}
          />
        )}
        {children}
      </div>
    </div>
  );
}

export default Layout;
