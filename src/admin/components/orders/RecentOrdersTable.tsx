import type { FC } from "react";

export interface RecentOrder {
  orderId: string;
  customer: {
    name: string;
    email: string;
    avatar: string;
  };
  type: "Store" | "Shop";
  currency: string;
  amount: string;
  status: "Completed" | "Processing" | "Failed";
  date: string;
}

interface RecentOrdersTableProps {
  orders: RecentOrder[];

  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/* -------------------- BADGES -------------------- */

const StatusBadge: FC<{ status: RecentOrder["status"] }> = ({ status }) => {
  const statusClasses = {
    Completed: "bg-green-100 text-green-700",
    Processing: "bg-yellow-100 text-yellow-700",
    Failed: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${statusClasses[status]}`}
    >
      {status}
    </span>
  );
};

const TypeBadge: FC<{ type: RecentOrder["type"] }> = ({ type }) => {
  const typeClasses = {
    Store: "bg-blue-100 text-blue-700",
    Shop: "bg-purple-100 text-purple-700",
  };

  return (
    <span
      className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${typeClasses[type]}`}
    >
      {type}
    </span>
  );
};

/* -------------------- TABLE -------------------- */

const RecentOrdersTable: FC<RecentOrdersTableProps> = ({
  orders,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Orders</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Order ID</th>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Currency</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Date</th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-6 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.orderId} className="border-b bg-white">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {order.orderId}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={order.customer.avatar}
                        alt={order.customer.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <div className="font-medium text-gray-900">
                          {order.customer.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.customer.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <TypeBadge type={order.type} />
                  </td>
                  <td className="px-6 py-4">{order.currency}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {order.amount}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4">{order.date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between items-center pt-4 text-sm text-gray-600">
        <p>
          Page {currentPage} of {totalPages}
        </p>

        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 border rounded-md hover:bg-gray-50 disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`px-3 py-1 border rounded-md ${
                page === currentPage
                  ? "bg-purple-600 text-white"
                  : "hover:bg-gray-50"
              }`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          ))}

          <button
            className="px-3 py-1 border rounded-md hover:bg-gray-50 disabled:opacity-50"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecentOrdersTable;
