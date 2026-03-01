import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import Loader from "@/components/Loader";
import NotFound from "@/components/NotFound";
import CustomSelect, { type Option } from "@/components/ui/CustomSelect";
import { Pagination } from "@/components/ui/Pagination";
import type { TransactionStatus } from "@/types";
import { useGetAdminTransactions } from "@/hooks/use-transaction";
import { getCurrencySymbol } from "@/_docs/doc";

const STATUS_OPTIONS: Option<TransactionStatus | "All">[] = [
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

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  SUBSCRIPTION_PAYMENT: { bg: "bg-blue-100", text: "text-blue-700" },
  SUBSCRIPTION_RENEWAL: { bg: "bg-purple-100", text: "text-purple-700" },
  SUBSCRIPTION_UPGRADE: { bg: "bg-emerald-100", text: "text-emerald-700" },
  SUBSCRIPTION_DOWNGRADE: { bg: "bg-orange-100", text: "text-orange-700" },
  MANUAL_CREDIT: { bg: "bg-green-100", text: "text-green-700" },
  MANUAL_DEBIT: { bg: "bg-red-100", text: "text-red-700" },
};

interface TransactionsSectionProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export default function TransactionsSection({
  search,
  onSearchChange,
}: TransactionsSectionProps) {
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | "All">(
    "All",
  );
  const [currentPage, setCurrentPage] = useState(1);

  const { data: transactionsData, isLoading } = useGetAdminTransactions();

  const transactions = transactionsData || [];

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesSearch =
        tx.uid.toLowerCase().includes(search.toLowerCase()) ||
        tx.userUid.toLowerCase().includes(search.toLowerCase()) ||
        tx.user?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        tx.amount.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || tx.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [transactions, search, statusFilter]);

  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredTransactions.slice(start, start + PAGE_SIZE);
  }, [filteredTransactions, currentPage]);

  if (isLoading) return <Loader />;

  return (
    <div>
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
            placeholder="Search by transaction ID, user..."
            value={search}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition text-sm"
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
      {paginatedTransactions.length > 0 ? (
        <>
          <div className="hidden md:block">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-gray-200 rounded-lg overflow-hidden bg-white"
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
                  {paginatedTransactions.map((tx, idx) => (
                    <motion.tr
                      key={tx.uid}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border-b border-gray-200 hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{tx.id}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={tx.user?.image || "/Sarah.png"}
                            alt={tx.user?.fullName}
                            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                          />
                          <div>
                            <p className="text-sm text-gray-700">
                              {tx.user?.fullName || "Unknown"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {tx.user?.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            TYPE_COLORS[tx.type]?.bg || "bg-gray-100"
                          } ${TYPE_COLORS[tx.type]?.text || "text-gray-700"}`}
                        >
                          {tx.type.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">
                          {getCurrencySymbol(tx.currency)}
                          {tx.amount.toLocaleString()}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            STATUS_COLORS[tx.status].bg
                          } ${STATUS_COLORS[tx.status].text}`}
                        >
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(tx.timestamp).toLocaleDateString()}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </div>

          {/* Mobile View */}
          <div className="md:hidden space-y-3">
            {paginatedTransactions.map((tx, idx) => (
              <motion.div
                key={tx.uid}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white border border-gray-200 rounded-lg p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={tx.user?.image || "/Sarah.png"}
                      alt={tx.user?.fullName}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">
                        {tx.user?.fullName}
                      </p>
                      <p className="text-xs text-gray-500">{tx.user?.email}</p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      STATUS_COLORS[tx.status].bg
                    } ${STATUS_COLORS[tx.status].text}`}
                  >
                    {tx.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">Amount</p>
                    <p className="font-medium text-gray-900">
                      {getCurrencySymbol(tx.currency)}
                      {tx.amount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Type</p>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${
                        TYPE_COLORS[tx.type]?.bg || "bg-gray-100"
                      } ${TYPE_COLORS[tx.type]?.text || "text-gray-700"}`}
                    >
                      {tx.type.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-500">Date</p>
                    <p className="font-medium text-gray-900">
                      {new Date(tx.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {filteredTransactions.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalItems={filteredTransactions.length}
              itemsPerPage={PAGE_SIZE}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      ) : (
        <NotFound title="No transactions found." className="mt-8" />
      )}
    </div>
  );
}
