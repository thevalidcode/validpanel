import type { FC } from "react";
import {
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  PlayIcon,
} from "@heroicons/react/24/outline";

// Define the shape of a store (same as in MyStores.tsx)
interface Store {
  name: string;
  type: string;
  date: string;
  status: string;
  logo?: string;
}

// Define props for StoreCard
interface StoreCardProps {
  store: Store;
}

const StoreCard: FC<StoreCardProps> = ({ store }) => {
  //   const { name, type, date, status, logo } = store;

  return (
    <div className="bg-white rounded-lg p-5 shadow-sm hover:shadow-md transition border-l-4 border-l-primary ">
      <div className="flex justify-between items-start">
        {/* Store info */}
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-gray-200 rounded-md overflow-hidden">
            {store.logo ? (
              <img
                src={store.logo}
                alt={store.name}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                No logo
              </div>
            )}
          </div>

          <div>
            <h3 className="font-semibold text-gray-800">{store.name}</h3>
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${
                store.type === "Shop"
                  ? "bg-primary text-white"
                  : "bg-blue-600 text-white"
              }`}
            >
              {store.type}
            </span>
            <p className="text-xs text-gray-500 mt-1">
              Created on {store.date}
            </p>
          </div>
        </div>

        {/* Status */}
        <div
          className={`text-xs font-medium px-2 py-1 rounded-full h-fit ${
            store.status === "Active"
              ? "bg-green-100 text-green-600"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {store.status}
        </div>
      </div>

      <hr className="my-4 text-gray-300" />

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <button className="flex items-center gap-1 bg-[#F3F4F6] text-gray-800 text-sm px-3 py-1 rounded-md">
          <EyeIcon className="w-4 h-4" /> View
        </button>

        <button className="flex items-center gap-1 bg-[#F3F4F6] text-gray-800 text-sm px-3 py-1 rounded-md">
          <EyeIcon className="w-4 h-4" /> Admin View
        </button>

        <button className="flex items-center gap-1 bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-md">
          <PencilSquareIcon className="w-4 h-4" /> Edit
        </button>

        <button className="flex items-center gap-1 bg-green-100 text-green-600 text-sm px-3 py-1 rounded-md">
          <PlayIcon className="w-4 h-4" />
        </button>

        <button className="flex items-center gap-1 bg-red-100 text-red-600 text-sm px-3 py-1 rounded-md">
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default StoreCard;
