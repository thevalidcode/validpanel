import React, { useState, type JSX } from "react";
// import Header from "../Header";
import Sidebar from "../components/User/Sidebar";
import StoreTable from "../components/User/storeTable";
import Toggle from "../components/User/Toggle";
// import StoreTable from "../storeTable";
// import Sidebar from "../Sidebar";

// ✅ Define prop types for StatCard
interface StatCardProps {
  title: string;
  value: string;
  color: string;
  icon: string;
}

// ✅ Dashboard Component
export default function Dashboard(): JSX.Element {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`absolute inset-y-0 left-0 z-50 w-64 bg-white border-r shadow-sm transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:relative md:translate-x-0 md:shadow-none`}
      >
        <Sidebar />
      </div>

      {/* Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-h-screen">
        <Toggle onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 md:p-6 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              title="Total Stores"
              value="247"
              color="text-blue-700"
              icon="TotalS.svg"
            />
            <StatCard
              title="Active Stores"
              value="198"
              color="text-green-700"
              icon="ActiveS.svg"
            />
            <StatCard
              title="Paused Stores"
              value="32"
              color="text-yellow-700"
              icon="Pausedstore.svg"
            />
            <StatCard
              title="This Month"
              value="17"
              color="text-purple-700"
              icon="Calender.svg"
            />
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-lg shadow-sm p-4 overflow-x-auto">
            <StoreTable />
          </div>
        </main>
      </div>
    </div>
  );
}

// ✅ StatCard Component
function StatCard({ title, value, color, icon }: StatCardProps): JSX.Element {
  return (
    <div
      className={`flex justify-between items-center p-4 rounded-lg border border-gray-300 bg-white ${color}`}
    >
      <div className="text-left">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
      <img src={icon} alt={`${title} icon`} />
    </div>
  );
}
