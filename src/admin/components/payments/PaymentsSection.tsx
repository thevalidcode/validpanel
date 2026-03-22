import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import Loader from "@/components/Loader";
import NotFound from "@/components/NotFound";
import CustomSelect, { type Option } from "@/components/ui/CustomSelect";
import { Pagination } from "@/components/ui/Pagination";
import type { PaymentStatus } from "@/types";
import { useGetPaymentsForAdmins } from "@/hooks/use-payment";
import { getCurrencySymbol } from "@/_docs/doc";

const STATUS_OPTIONS: Option<PaymentStatus | "All">[] = [
  { label: "All Status", value: "All" },
  { label: "Success", value: "SUCCESS" },
  { label: "Pending", value: "PENDING" },
  { label: "Failed", value: "FAILED" },
];

const PAGE_SIZE = 10;

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  SUCCESS: { bg: "bg-emerald-100", text: "text-emerald-700" },
  PENDING: { bg: "bg-yellow-100", text: "text-yellow-700" },
  FAILED: { bg: "bg-red-100", text: "text-red-700" },
};

interface PaymentsSectionProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export default function PaymentsSection({
  search,
  onSearchChange,
}: PaymentsSectionProps) {
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "All">(
    "All",
  );
  const [currentPage, setCurrentPage] = useState(1);

  const { data: paymentsData, isLoading } = useGetPaymentsForAdmins();

  const payments = paymentsData
    ? Array.isArray(paymentsData)
      ? paymentsData
      : [paymentsData]
    : [];

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const matchesSearch =
        payment.uid.toLowerCase().includes(search.toLowerCase()) ||
        payment.user?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        payment.chargedAmount.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || payment.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [payments, search, statusFilter]);

  const paginatedPayments = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredPayments.slice(start, start + PAGE_SIZE);
  }, [filteredPayments, currentPage]);

  if (isLoading) return <Loader />;

  return (
    <div>
      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3 bg-white px-5 py-3 rounded-[4px] border border-gray-200 mb-6"
      >
        <div className="flex-1 relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by payment ID, user..."
            value={search}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-[4px] focus:outline-none focus:ring-1 focus:ring-primary transition text-sm"
          />
        </div>
        <div className="sm:w-40">
          <CustomSelect
            options={STATUS_OPTIONS}
            value={STATUS_OPTIONS.find((s) => s.value === statusFilter)}
            onChange={(option) => {
              if (Array.isArray(option)) return;
              setStatusFilter(option.value);
              setCurrentPage(1);
            }}
            placeholder="Filter status"
          />
        </div>
      </motion.div>

      {/* Desktop Table */}
      {paginatedPayments.length > 0 ? (
        <>
          <div className="hidden md:block">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-gray-200 rounded-[4px] overflow-hidden bg-white"
            >
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      Plan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      Coupon
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
                  {paginatedPayments.map((payment, idx) => (
                    <motion.tr
                      key={payment.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border-b border-gray-200 hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">
                          {payment.id}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={payment.user?.image || "/Sarah.png"}
                            alt={payment.user?.fullName}
                            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                          />
                          <div>
                            <p className="text-sm text-gray-700">
                              {payment.user?.fullName || "Unknown"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {payment.user?.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-700">
                          {payment.plan?.name}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">
                          {getCurrencySymbol(payment.currency)}
                          {payment.chargedAmount.toLocaleString()}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        {payment.coupon ? (
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {payment.coupon.code}
                            </span>
                            <span className="text-xs text-gray-600">
                              {payment.coupon.type === "PERCENTAGE"
                                ? `${payment.coupon.value}%`
                                : `${getCurrencySymbol(payment.coupon.currency || payment.currency)}${payment.coupon.value}`}
                            </span>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">—</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            STATUS_COLORS[payment.status].bg
                          } ${STATUS_COLORS[payment.status].text}`}
                        >
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </div>

          {/* Mobile View */}
          <div className="md:hidden space-y-3">
            {paginatedPayments.map((payment, idx) => (
              <motion.div
                key={payment.uid}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white border border-gray-200 rounded-[4px] p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={payment.user?.image || "/Sarah.png"}
                      alt={payment.user?.fullName}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">
                        {payment.user?.fullName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {payment.user?.email}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      STATUS_COLORS[payment.status].bg
                    } ${STATUS_COLORS[payment.status].text}`}
                  >
                    {payment.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">Amount</p>
                    <p className="font-medium text-gray-900">
                      {getCurrencySymbol(payment.currency)}
                      {payment.chargedAmount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Plan</p>
                    <p className="font-medium text-gray-900">
                      {payment.plan?.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Date</p>
                    <p className="font-medium text-gray-900">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Coupon</p>
                    {payment.coupon ? (
                      <p className="font-mono font-bold text-xs text-blue-700">
                        {payment.coupon.code}
                      </p>
                    ) : (
                      <p className="text-gray-500">—</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {filteredPayments.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalItems={filteredPayments.length}
              itemsPerPage={PAGE_SIZE}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      ) : (
        <NotFound title="No payments found." className="mt-8" />
      )}
    </div>
  );
}
