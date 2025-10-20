import { type FC, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import MyStores from "./MyStores";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const StoreLayout: FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleCreateStore = (): void => {
    console.log("Create new store clicked");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b">
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
        className={`fixed md:static top-0 left-0 h-full bg-white border-r w-60 z-40 transform transition-transform duration-300 ease-in-out
        ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <Sidebar />
      </aside>

      {/* Overlay (for mobile sidebar) */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-gray-100 opacity-80 md:hidden"
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-4 sm:p-6 flex-1">
          <div className="flex justify-end mb-6">
            <button
              onClick={handleCreateStore}
              className="bg-[#7D1EFE] text-white px-4 py-2 rounded-md hover:bg-purple-700 flex items-center gap-2 text-sm sm:text-base"
            >
              + Create New Store
            </button>
          </div>

          <MyStores />
        </main>
      </div>
    </div>
  );
};

export default StoreLayout;
