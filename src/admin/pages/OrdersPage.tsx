import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import Layout from "@/admin/components/Layout";
import Loader from "@/components/Loader";
import NotFound from "@/components/NotFound";
import CustomSelect, { type Option } from "@/components/ui/CustomSelect";
import { useGetAllOrders } from "@/hooks/use-order";
import type { OrderStatus, StoreType } from "@/types";

const ORDER_STATUS_OPTIONS: Option<OrderStatus | "All">[] = [
  { label: "All Status", value: "All" },
  { label: "Pending", value: "PENDING" },
  { label: "Processing", value: "PROCESSING" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
  { label: "Failed", value: "FAILED" },
];

const STORE_TYPE_OPTIONS: Option<StoreType | "All">[] = [
  { label: "All Types", value: "All" },
  { label: "Social Media", value: "SOCIAL" },
  { label: "Shop", value: "SHOP" },
  { label: "Digital", value: "DIGITAL" },
];

const PAGE_SIZE = 10;

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  PENDING: { bg: "bg-yellow-100", text: "text-yellow-700" },
  PROCESSING: { bg: "bg-blue-100", text: "text-blue-700" },
  COMPLETED: { bg: "bg-emerald-100", text: "text-emerald-700" },
  CANCELLED: { bg: "bg-gray-100", text: "text-gray-700" },
  FAILED: { bg: "bg-red-100", text: "text-red-700" },
};

const OrdersPage = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "All">("All");
  const [storeTypeFilter, setStoreTypeFilter] = useState<StoreType | "All">(
    "All"
  );
  const [currentPage, setCurrentPage] = useState(1);

  const { data: ordersData, isLoading } = useGetAllOrders({
    page: currentPage,
    limit: PAGE_SIZE,
  });

  const orders = ordersData?.orders || [];

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(search.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(search.toLowerCase()) ||
        order.customer.email.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || order.status === statusFilter;
      const matchesStoreType =
        storeTypeFilter === "All" || order.storeType === storeTypeFilter;

      return matchesSearch && matchesStatus && matchesStoreType;
    });
  }, [orders, search, statusFilter, storeTypeFilter]);

  if (isLoading) return <Loader />;

  return (
    <Layout title="Orders" description="View and manage all store orders.">
      <div className="py-5 px-6 w-full">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-3 bg-white px-5 py-3 rounded-lg border border-gray-200 mb-6"
        >
          <div className="flex-1 relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search by order ID, customer..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition text-sm"
            />
          </div>
          <div className="sm:w-40">
            <CustomSelect
              options={ORDER_STATUS_OPTIONS}
              value={ORDER_STATUS_OPTIONS.find((s) => s.value === statusFilter)}
              onChange={(option) => {
                if (!Array.isArray(option)) {
                  setStatusFilter(option.value);
                }
                setCurrentPage(1);
              }}
              placeholder="Filter status"
            />
          </div>
          <div className="sm:w-40">
            <CustomSelect
              options={STORE_TYPE_OPTIONS}
              value={STORE_TYPE_OPTIONS.find(
                (s) => s.value === storeTypeFilter
              )}
              onChange={(option) => {
                if (!Array.isArray(option)) {
                  setStoreTypeFilter(option.value);
                }
                setCurrentPage(1);
              }}
              placeholder="Filter type"
            />
          </div>
        </motion.div>

        {/* Desktop Table */}
        {filteredOrders.length > 0 ? (
          <>
            <div className="hidden md:block">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order, idx) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className="border-b border-gray-200 hover:bg-gray-50 transition"
                      >
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-900">
                            {order.id}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">
                              {order.customer.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {order.customer.email}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-700">
                            {order.storeType === "SOCIAL"
                              ? "Social Media"
                              : order.storeType === "SHOP"
                              ? "Shop"
                              : "Digital"}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-900">
                            {order.amount} {order.currency}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              STATUS_COLORS[order.status].bg
                            } ${STATUS_COLORS[order.status].text}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            </div>

            {/* Mobile View */}
            <div className="md:hidden space-y-3">
              {filteredOrders.map((order, idx) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white border border-gray-200 rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{order.id}</p>
                      <p className="text-xs text-gray-500">
                        {order.customer.name}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        STATUS_COLORS[order.status].bg
                      } ${STATUS_COLORS[order.status].text}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {order.customer.email}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-500">Amount</p>
                      <p className="font-medium text-gray-900">
                        {order.amount} {order.currency}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Type</p>
                      <p className="font-medium text-gray-900">
                        {order.storeType === "SOCIAL"
                          ? "Social"
                          : order.storeType === "SHOP"
                          ? "Shop"
                          : "Digital"}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          <NotFound title="No orders found." className="mt-8" />
        )}
      </div>
    </Layout>
  );
};

export default OrdersPage;
