import type { FC, ReactNode } from "react";
import { Eye } from "lucide-react";

export interface StoreData {
  id: number;
  name: string;
  created: string;
  category: string;
  revenue: string;
  orders: number;
  status: "Active" | "Pending";
  icon: ReactNode;
  iconBg: string;
}

interface AllStoresTableProps {
  data: StoreData[];
}

const StatusBadge: FC<{ status: StoreData["status"] }> = ({ status }) => {
  const baseClasses = "px-2.5 py-0.5 text-xs font-medium rounded-full";
  const statusClasses = {
    Active: "bg-green-100 text-green-800",
    Pending: "bg-yellow-100 text-yellow-800",
  };
  return (
    <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>
  );
};

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
                Category
              </th>
              <th scope="col" className="px-6 py-3">
                Revenue
              </th>
              <th scope="col" className="px-6 py-3">
                Orders
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
              <tr key={store.id} className="bg-white border-b border-gray-200">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${store.iconBg}`}>
                      {store.icon}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">
                        {store.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {store.created}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">{store.category}</td>
                <td className="px-6 py-4 font-bold text-gray-900">
                  {store.revenue}
                </td>
                <td className="px-6 py-4">{store.orders}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={store.status} />
                </td>
                <td className="px-6 py-4">
                  <button
                    type="button"
                    title="see"
                    className="text-purple-600 hover:text-purple-800"
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
