import type { FC } from "react";
import { Eye } from "lucide-react";
import type { Store } from "@/types";
import { StatusBadge } from "@/utils/store.utils";

interface AllStoresTableProps {
  data: Store[];
}

const AllStoresTable: FC<AllStoresTableProps> = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-4">All Stores</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                Store Name
              </th>
              <th scope="col" className="px-6 py-3">
                Type
              </th>
              <th scope="col" className="px-6 py-3">
                Plan
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((store) => (
              <tr
                key={store.storeId}
                className="bg-white border-t border-gray-200 hover:bg-gray-50 transition"
              >
                <td className="px-6 py-4 flex items-center gap-3">
                  <img
                    src={store.logoUrl}
                    alt={store.name}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">
                      {store.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(store.timestamp).toDateString()}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 capitalize">
                  {store.type.toLowerCase()}
                </td>
                <td className="px-6 py-4">{store.plan}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={store.status} />
                </td>
                <td className="px-6 py-4">
                  <button
                    type="button"
                    onClick={() =>
                      window.open(`https://${store.uid}`, "_blank")
                    }
                    title="View Store"
                    className="text-purple-600 hover:text-purple-800 transition"
                  >
                    <Eye size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllStoresTable;
