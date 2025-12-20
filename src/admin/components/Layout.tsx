import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useAppContext } from "@/context/useAppContext";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

function Layout({
  children,
  title,
  description,
}: {
  children: React.ReactNode;
  title?: string;
  description?: string;
}) {
  const isMobile = useIsMobile();

  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (isMobile) return false; // mobile always starts closed
    const saved = localStorage.getItem("sidebarOpen");
    return saved ? JSON.parse(saved) : true; // desktop remembers state
  });

  const { adminInfo, isAuthLoading } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (isMobile) localStorage.setItem("sidebarOpen", JSON.stringify(false));
  }, [isMobile]);

  useEffect(() => {
    if (!isAuthLoading && adminInfo) {
      // The adminInfo should be turned to false after the authentication system has been worked on
      navigate("/");
    }
  }, [isAuthLoading, adminInfo, navigate]);

  useEffect(() => {
    if (title) {
      document.title = `${title} | Valid Panel`;
    }
  }, [title]);

  // Save sidebar state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  const toggleSidebar = (state?: boolean) => {
    // Only update localStorage for desktop (md+) so desktop remembers its state
    if (!isMobile) {
      setSidebarOpen((prev: boolean) => {
        const nextState = state ?? !prev;
        localStorage.setItem("sidebarOpen", JSON.stringify(nextState));
        return nextState;
      });
    } else {
      // Mobile toggle just updates state, not localStorage
      setSidebarOpen(state ?? !sidebarOpen);
    }
  };

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
  ${sidebarOpen ? "translate-x-0 w-64" : "-translate-x-[100%] w-0"}`}
      >
        <Sidebar isMobile={isMobile} onNavClick={() => toggleSidebar(false)} />
      </aside>

      {/* Overlay (for mobile sidebar) */}
      {sidebarOpen && isMobile && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-gray-100/40 backdrop-blur-sm md:hidden z-50"
        ></div>
      )}

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col ${
          isMobile ? "" : sidebarOpen ? "ml-64 " : ""
        }`}
      >
        {title && description && (
          <Header
            title={title}
            description={description}
            onToggleSidebar={() => toggleSidebar()}
            isSidebarOpen={sidebarOpen}
          />
        )}
        {children}
      </div>
    </div>
  );
}

export default Layout;
