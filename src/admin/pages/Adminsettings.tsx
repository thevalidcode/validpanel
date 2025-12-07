// src/pages/SettingsPage.tsx
import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import AdminSettings from "../components/settings/SystemSettings";

// import Header from "../Header";

const AdminScreen: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`absolute inset-y-0 left-0 z-50 w-64 bg-white border-r shadow-sm transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:relative md:translate-x-0 md:shadow-none`}
      >
        <Sidebar role="admin" />
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 p-6">
        <AdminSettings onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      </main>
    </div>
  );
};

export default AdminScreen;
