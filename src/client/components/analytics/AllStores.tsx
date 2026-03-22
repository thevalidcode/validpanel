import type { FC } from "react";
import type { Store } from "@/types";
import { StatusBadge } from "@/utils/store.utils";

interface AllStoreItemProps {
  store: Store;
}

const AllStoreItem: FC<AllStoreItemProps> = ({ store }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
    <div className="flex items-center gap-4">
      {store.logoUrl ? (
        <img
          src={store.logoUrl}
          alt={store.name}
          className="w-10 h-10 object-cover rounded-[4px]"
        />
      ) : (
        <div className="flex items-center w-10 h-10 rounded-[4px] justify-center text-gray-400 text-xs">
          No logo
        </div>
      )}
      <div>
        <p className="font-semibold text-gray-800">{store.name}</p>
        <p className="text-xs text-gray-500">
          {`Created ${new Date(store.timestamp).toDateString()}`}
        </p>
        <p className="text-xs text-gray-400 capitalize">
          {store.type.toLowerCase()}
        </p>
      </div>
    </div>
    <div className="text-right">
      <p className="font-bold text-purple-600">{store.plan}</p>
      <p className="text-xs mt-1">
        <StatusBadge status={store.status} />
      </p>
    </div>
  </div>
);

interface AllStoresProps {
  stores: Store[];
}

const AllStores: FC<AllStoresProps> = ({ stores }) => {
  return (
    <div className="bg-white rounded-[4px] shadow-sm border border-gray-200 p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">All Stores</h2>
      <div>
        {stores.map((store) => (
          <AllStoreItem key={store.storeId} store={store} />
        ))}
      </div>
    </div>
  );
};

export default AllStores;
