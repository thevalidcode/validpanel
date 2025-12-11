import React, { useState } from "react";
import {
  PencilSquareIcon,
  PlayIcon,
  TrashIcon,
  PauseIcon,
} from "@heroicons/react/24/outline";

type Store = {
  id: string;
  name: string;
  owner: string;
  email: string;
  type: "Shop" | "Store";
  img: string;
  status: "Active" | "Paused";
  created: string;
};

const stores: Store[] = [
  {
    id: "VP001",
    name: "ValidPlug Store",
    owner: "John Doe",
    email: "john@example.com",
    type: "Shop",
    img: "https://randomuser.me/api/portraits/men/12.jpg",
    status: "Active",
    created: "Dec 15, 2023",
  },
  {
    id: "TH002",
    name: "TechHub Market",
    owner: "Sarah Wilson",
    email: "sarah@techhub.com",
    type: "Store",
    img: "Rectangle 67.png",
    status: "Paused",
    created: "Nov 28, 2023",
  },
  {
    id: "FF003",
    name: "Fashion Forward",
    owner: "Emma Johnson",
    email: "emma@fashion.com",
    type: "Shop",
    img: "Rectangle 67.png",
    status: "Active",
    created: "Oct 12, 2023",
  },
  {
    id: "CP004",
    name: "Creative Portfolio",
    owner: "Mike Chen",
    email: "mike@creative.com",
    type: "Store",
    img: "Sarah.png",
    status: "Active",
    created: "Jan 5, 2024",
  },
];

const StoreTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterType, setFilterType] = useState<"All" | "Shop" | "Store">("All");
  const [filterStatus, setFilterStatus] = useState<"All" | "Active" | "Paused">(
    "All"
  );

  const filteredStores = stores.filter((store) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      store.name.toLowerCase().includes(term) ||
      store.owner.toLowerCase().includes(term);
    const matchesType = filterType === "All" || store.type === filterType;
    const matchesStatus =
      filterStatus === "All" || store.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="bg-white">
      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Search stores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-auto"
          />

          <select
            title="store"
            value={filterType}
            onChange={(e) =>
              setFilterType(e.target.value as "All" | "Shop" | "Store")
            }
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All Types</option>
            <option value="Shop">Shop</option>
            <option value="Store">Store</option>
          </select>

          <select
            title="status"
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(e.target.value as "All" | "Active" | "Paused")
            }
            className=" border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Paused">Paused</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button className="  rounded-md px-4 py-2 text-sm hover:bg-gray-50 transition">
            Export
          </button>
          <button className="  rounded-md px-4 py-2 text-sm hover:bg-gray-50 transition">
            Filter
          </button>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-sm text-gray-500">
              <th className="py-3 px-4 font-medium">Store Info</th>
              <th className="py-3 px-4 font-medium">Owner</th>
              <th className="py-3 px-4 font-medium">Type</th>
              <th className="py-3 px-4 font-medium">Status</th>
              <th className="py-3 px-4 font-medium">Created</th>
              <th className="py-3 px-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStores.length > 0 ? (
              filteredStores.map((store) => (
                <tr
                  key={store.id}
                  className="border-b border-gray-200 hover:bg-gray-50 text-sm transition"
                >
                  {/* Store Info */}
                  <td className="py-3 px-4">
                    <p className="font-medium text-gray-800">{store.name}</p>
                    <p className="text-xs text-gray-500">{store.id}</p>
                  </td>

                  {/* Owner Info */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={store.img}
                        alt={store.owner}
                        className="w-9 h-9 rounded-full object-cover border"
                      />
                      <div>
                        <p className="font-medium text-gray-800">
                          {store.owner}
                        </p>
                        <p className="text-xs text-gray-500">{store.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Store Type */}
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 text-xs bg-indigo-50 text-indigo-600 rounded-md font-medium">
                      {store.type}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-md font-medium ${
                        store.status === "Active"
                          ? "bg-green-50 text-green-600"
                          : "bg-yellow-50 text-yellow-600"
                      }`}
                    >
                      {store.status}
                    </span>
                  </td>

                  {/* Created Date */}
                  <td className="py-3 px-4 text-gray-600">{store.created}</td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <ActionButtons status={store.status} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-6 text-gray-500 text-sm"
                >
                  No stores found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-4 md:hidden">
        {filteredStores.length > 0 ? (
          filteredStores.map((store) => (
            <div
              key={store.id}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-800">{store.name}</h3>
                  <p className="text-sm text-gray-500">{store.id}</p>
                </div>
                <ActionButtons status={store.status} />
              </div>
              <div className="mt-3 text-sm text-gray-700">
                <p>
                  <span className="font-medium">Owner:</span> {store.owner}
                </p>
                <p className="text-gray-500 text-xs">{store.email}</p>
                <p className="mt-2">
                  <span className="font-medium">Type:</span>{" "}
                  <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-xs rounded-md">
                    {store.type}
                  </span>
                </p>
                <p className="mt-1">
                  <span className="font-medium">Status:</span>{" "}
                  <span
                    className={`px-2 py-0.5 text-xs rounded-md font-medium ${
                      store.status === "Active"
                        ? "bg-green-50 text-green-600"
                        : "bg-yellow-50 text-yellow-600"
                    }`}
                  >
                    {store.status}
                  </span>
                </p>
                <p className="mt-1 text-gray-500 text-xs">
                  Created: {store.created}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-6">No stores found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-between items-center text-sm text-gray-600">
        <p>
          Showing {filteredStores.length} of {stores.length} results
        </p>
        <div className="flex gap-2">
          <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
            Previous
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

// ActionButtons subcomponent with typed props
type ActionButtonsProps = {
  status: "Active" | "Paused";
};

const ActionButtons: React.FC<ActionButtonsProps> = ({ status }) => {
  return (
    <div className="flex gap-2 justify-end">
      <button
        className="text-indigo-500 hover:text-indigo-700 transition"
        title="Edit"
      >
        <PencilSquareIcon className="w-5 h-5" />
      </button>

      {status === "Paused" ? (
        <button
          className="text-green-500 hover:text-green-700 transition"
          title="Resume"
        >
          <PlayIcon className="w-5 h-5" />
        </button>
      ) : (
        <button
          className="text-yellow-500 hover:text-yellow-700 transition"
          title="Pause"
        >
          <PauseIcon className="w-5 h-5" />
        </button>
      )}

      <button
        className="text-red-500 hover:text-red-700 transition"
        title="Delete"
      >
        <TrashIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default StoreTable;
