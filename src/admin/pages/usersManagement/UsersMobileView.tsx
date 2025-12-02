// import { useState } from "react";
import { MoreVertical } from "lucide-react";
import type { FC } from "react";

interface Member {
  id: number;
  name: string;
  email: string;
  stores: number;
  status: string;
}

interface UsersMobileViewProps {
  search: string;
  onSetSearch: (value: string) => void;
  filter: string;
  onSetFilter: (value: string) => void;
  users: Array<Member>;
  onHandleLoadMore: () => void;
}

const UsersMobileView: FC<UsersMobileViewProps> = ({
  search,
  onSetSearch,
  filter,
  onSetFilter,
  users,
  onHandleLoadMore,
}) => {
  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto p-4 space-y-4">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by name or email"
        value={search}
        onChange={(e) => onSetSearch(e.target.value)}
        className="w-full border border-gray-300 text-sm pl-6 rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />

      {/* Filter Dropdown */}
      <select
        title="status"
        value={filter}
        onChange={(e) => onSetFilter(e.target.value)}
        className="w-full border border-gray-300 rounded-lg py-2 px-6 focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        <option value="All">All</option>
        <option value="Active">Active</option>
        <option value="Banned">Banned</option>
      </select>

      {/* User Cards */}
      <div className="w-full space-y-3">
        {users.map((user) => (
          <div
            key={user.id}
            className="border border-t-4 border-gray-200 rounded-lg py-5 px-[17px] hover:border-primary transition-all flex justify-between items-start shadow-sm"
          >
            <div className="space-y-4">
              <p className="font-medium text-gray-900">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
              <div className="flex gap-2">
                <span className="bg-gray-100 text-xs text-gray-700 px-2 py-1 rounded-full">
                  {user.stores} {user.stores > 1 ? "Stores" : "Store"}
                </span>
                <span
                  className={`text-sm px-2 py-1 rounded-full ${
                    user.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {user.status}
                </span>
              </div>
            </div>
            <MoreVertical className="text-gray-400 cursor-pointer" />
          </div>
        ))}
      </div>

      {/* Load More Button */}
      <button
        onClick={onHandleLoadMore}
        className="border border-purple-500 mt-8 text-purple-600 hover:bg-purple-50 px-4 py-2 rounded-lg font-medium"
      >
        Load More Users
      </button>
    </div>
  );
};

export default UsersMobileView;
