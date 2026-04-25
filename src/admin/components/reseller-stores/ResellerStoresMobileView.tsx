import type { ResellerStore } from "@/types";

interface ResellerStoresMobileViewProps {
  stores: ResellerStore[];
  handleAction: (uid: string, action: "Edit" | "Delete") => void;
}

export default function ResellerStoresMobileView({
  stores,
  handleAction,
}: ResellerStoresMobileViewProps) {
  if (stores.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-[4px] border border-gray-200 text-center">
        <p className="text-gray-500 text-sm">No reseller stores found</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {stores.map((store) => (
        <div
          key={store.uid}
          className="bg-white p-4 rounded-[4px] border border-gray-200 shadow-sm space-y-3"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 truncate">
                {store.name}
              </h3>
              <p className="text-xs text-gray-500 mt-1 truncate">{store.url}</p>
            </div>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                store.isActive
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {store.isActive ? "Active" : "Inactive"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-gray-500 block mb-0.5">Type</span>
              <span className="font-medium text-gray-900">{store.type}</span>
            </div>
            <div>
              <span className="text-gray-500 block mb-0.5">Visibility</span>
              <span className="font-medium text-gray-900">
                {store.isInternal ? "Internal" : "External"}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => handleAction(store.uid, "Edit")}
              className="rounded-[4px] border border-gray-200 px-3 py-1.5 text-xs text-gray-700"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => handleAction(store.uid, "Delete")}
              disabled={store.isInternal}
              className="rounded-[4px] border border-red-200 px-3 py-1.5 text-xs text-red-600 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
