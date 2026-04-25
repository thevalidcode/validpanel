import { useState } from "react";
import { Pagination } from "@/components/ui/Pagination";
import { paginate } from "@/utils/paginate";
import type { ResellerStore } from "@/types";

interface ResellerStoresDesktopViewProps {
  stores: ResellerStore[];
  handleAction: (uid: string, action: "Edit" | "Delete") => void;
}

export default function ResellerStoresDesktopView({
  stores,
  handleAction,
}: ResellerStoresDesktopViewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const { data: paginatedStores } = paginate(stores, currentPage, itemsPerPage);

  return (
    <div className="flex flex-col gap-2">
      <div className="overflow-x-auto border border-gray-200 rounded-[4px] bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">URL</th>
              <th className="px-6 py-3">Visibility</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedStores.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  No reseller stores found
                </td>
              </tr>
            ) : (
              paginatedStores.map((store) => (
                <tr
                  key={store.uid}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    <div className="flex items-center gap-3 min-w-0">
                      {store.image ? (
                        <img
                          src={store.image}
                          alt={store.name}
                          className="h-8 w-8 rounded-[4px] border border-gray-200 object-cover"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-[4px] border border-gray-200 bg-gray-100" />
                      )}
                      <span className="truncate">{store.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {store.type}
                  </td>
                  <td className="px-6 py-4 text-gray-500 max-w-[320px] truncate">
                    {store.url}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        store.isInternal
                          ? "bg-gray-100 text-gray-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {store.isInternal ? "Internal" : "External"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        store.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {store.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleAction(store.uid, "Edit")}
                        className="rounded-[4px] border border-gray-200 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAction(store.uid, "Delete")}
                        disabled={store.isInternal}
                        className="rounded-[4px] border border-red-200 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalItems={stores.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => {
          setItemsPerPage(size);
          setCurrentPage(1);
        }}
      />
    </div>
  );
}
