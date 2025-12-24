import { useState } from "react";
import type { Option } from "@/components/ui/CustomSelect";
import CustomSelect from "@/components/ui/CustomSelect";
import type { StoreStatus, StoreType } from "@/types";
import { Pagination } from "@/components/ui/Pagination";
import type { StoreWithOwner } from "@/types";
import { paginate } from "@/utils/paginate";
import { ActionButtons } from "./ActionButtons";

const StoreTable = ({
  stores,
  handleAction,
}: {
  stores: StoreWithOwner[];
  handleAction: (
    uid: string,
    action: "Delete" | "Resume" | "Pause" | "Edit"
  ) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterType, setFilterType] = useState<StoreType | "ALL">("ALL");
  const [filterStatus, setFilterStatus] = useState<StoreStatus | "ALL">("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [storesPerPage, setStoresPerPage] = useState(20);
  const filteredStores = stores.filter((store) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      store.name.toLowerCase().includes(term) ||
      String(store.storeId).toLowerCase().includes(term) ||
      store.owner.fullName.toLowerCase().includes(term) ||
      store.owner.email.toLowerCase().includes(term);
    const matchesType = filterType === "ALL" || store.type === filterType;
    const matchesStatus =
      filterStatus === "ALL" || store.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const { data: paginatedStores } = paginate(
    filteredStores,
    currentPage,
    storesPerPage
  );

  const statusOptions: Option<StoreStatus | "ALL">[] = [
    { label: "All Status", value: "ALL" },
    { label: "Active", value: "ACTIVE" },
    { label: "Disabled", value: "DISABLED" },
    { label: "Expired", value: "EXPIRED" },
    { label: "Pending", value: "PENDING" },
  ];

  const typeOptions: Option<StoreType | "ALL">[] = [
    { label: "All Types", value: "ALL" },
    { label: "Shop", value: "SHOP" },
    { label: "Social Media Store", value: "SOCIAL" },
  ];

  return (
    <div className="bg-white">
      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-3 md:w-[60%]">
          <input
            type="text"
            placeholder="Search stores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full sm:w-auto"
          />
          <CustomSelect
            options={typeOptions}
            value={typeOptions.find((opt) => opt.value === filterType)}
            placeholder="Type"
            onChange={(selected) => {
              const option = selected as Option<StoreType | "ALL">;
              setFilterType(option.value);
            }}
            className="flex-1"
          />
          <CustomSelect
            options={statusOptions}
            value={statusOptions.find((opt) => opt.value === filterStatus)}
            placeholder="Status"
            onChange={(selected) => {
              const option = selected as Option<StoreStatus | "ALL">;
              setFilterStatus(option.value);
            }}
            className="flex-1"
          />
        </div>
        <div className="flex gap-2">
          <button className="  rounded-md px-4 py-2 text-sm hover:bg-gray-50 transition">
            Export
          </button>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50">
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
            {paginatedStores.length > 0 ? (
              paginatedStores.map((store) => (
                <tr
                  key={store.storeId}
                  className="border-t border-gray-200 hover:bg-gray-50 text-sm transition"
                >
                  {/* Store Info */}
                  <td className="py-3 px-4">
                    <p className="font-medium text-gray-800">{store.name}</p>
                    <p className="text-xs text-gray-500">{store.storeId}</p>
                  </td>

                  {/* Owner Info */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={store.owner.image || "/Sarah.png"}
                        alt={store.owner.fullName}
                        className="w-9 h-9 rounded-full object-cover border"
                      />
                      <div>
                        <p className="font-medium text-gray-800">
                          {store.owner.fullName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {store.owner.email}
                        </p>
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
                        store.status === "ACTIVE"
                          ? "bg-green-50 text-green-600"
                          : "bg-yellow-50 text-yellow-600"
                      }`}
                    >
                      {store.status}
                    </span>
                  </td>

                  {/* Created Date */}
                  <td className="py-3 px-4 text-gray-600">
                    {new Date(store.timestamp).toLocaleDateString()}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <ActionButtons store={store} handleAction={handleAction} />
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
        {paginatedStores.length > 0 ? (
          paginatedStores.map((store) => (
            <div
              key={store.storeId}
              className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-800">{store.name}</h3>
                  <p className="text-sm text-gray-500">{store.storeId}</p>
                </div>
                <ActionButtons store={store} handleAction={handleAction} />
              </div>
              <div className="mt-3 text-sm text-gray-700">
                <p>
                  <span className="font-medium">Owner:</span>{" "}
                  {store.owner.fullName}
                </p>
                <p className="text-gray-500 text-xs">{store.owner.email}</p>
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
                      store.status === "ACTIVE"
                        ? "bg-green-50 text-green-600"
                        : "bg-yellow-50 text-yellow-600"
                    }`}
                  >
                    {store.status}
                  </span>
                </p>
                <p className="mt-1 text-gray-500 text-xs">
                  Created: {new Date(store.timestamp).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-6">No stores found.</p>
        )}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalItems={filteredStores.length}
        itemsPerPage={storesPerPage}
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => {
          setStoresPerPage(size);
          setCurrentPage(1);
        }}
      />
    </div>
  );
};

export default StoreTable;
