import type { FC } from "react";
import { MoreVertical } from "lucide-react";

export interface Order {
  id: string;
  status: "Pending" | "Processing" | "Completed" | "Failed";
  orderType: string;
  time: string;
  customer: {
    name: string;
    avatar: string;
    service: string;
  };
  price: string;
}

interface OrderCardProps {
  order: Order;
}

const StatusBadge: FC<{ status: Order["status"] }> = ({ status }) => {
  const statusStyles: { [key in Order["status"]]: string } = {
    Pending: "bg-orange-100 text-orange-500",
    Processing: "bg-blue-100 text-blue-500",
    Completed: "bg-green-100 text-green-500",
    Failed: "bg-red-100 text-red-500",
  };
  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
};

const OrderCard: FC<OrderCardProps> = ({ order }) => {
  const { id, status, orderType, time, customer, price } = order;

  const getActionButtons = () => {
    switch (status) {
      case "Pending":
      case "Processing":
        return (
          <>
            <button className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700">
              View Details
            </button>
            <button className="flex-1 py-2 px-4 bg-purple-600 text-white rounded-lg text-sm font-medium">
              Mark Complete
            </button>
          </>
        );
      case "Completed":
        return (
          <>
            <button className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700">
              View History
            </button>
            <button className="flex-1 py-2 px-4 bg-purple-600 text-white rounded-lg text-sm font-medium">
              Completed
            </button>
          </>
        );
      case "Failed":
        return (
          <>
            <button className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700">
              View Details
            </button>
            <button className="flex-1 py-2 px-4 bg-purple-600 text-white rounded-lg text-sm font-medium">
              Retry Order
            </button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-bold text-gray-800">{id}</p>
          <p className="text-xs text-gray-500 mt-1">{`${orderType} • ${time}`}</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={status} />
          <MoreVertical size={20} className="text-gray-400" />
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img
            src={customer.avatar}
            alt={customer.name}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-medium text-gray-900">{customer.name}</p>
            <p className="text-sm text-gray-500">{customer.service}</p>
          </div>
        </div>
        <p className="font-bold text-gray-800">{price}</p>
      </div>

      <div className="flex gap-3 pt-2">{getActionButtons()}</div>
    </div>
  );
};

export default OrderCard;
