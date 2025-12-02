import React from "react";
import { Bars3Icon } from "@heroicons/react/24/outline";

type HeaderProps = {
  onMenuClick: () => void;
};

const Toggle: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="flex items-center justify-between bg-white border-b px-4 md:px-6 py-3">
      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-gray-700 hover:text-purple-700"
        onClick={onMenuClick}
        aria-label="Open sidebar"
      >
        <Bars3Icon className="w-6 h-6" />
      </button>

      {/* Page Title */}
      <h1 className="text-lg md:text-xl font-semibold text-gray-800">
        Stores Management
      </h1>

      {/* Admin Info */}
      <div className="flex items-center gap-3">
        <img
          src="https://randomuser.me/api/portraits/men/12.jpg"
          alt="Admin Avatar"
          className="w-8 h-8 rounded-full"
        />
        <span className="hidden sm:block text-sm font-medium text-gray-700">
          Admin User
        </span>
      </div>
    </header>
  );
};

export default Toggle;
