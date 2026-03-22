import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import Loader from "@/components/Loader";
import NotFound from "@/components/NotFound";
import ConfirmDialog from "@/components/ConfirmDialog";
import CustomSelect, { type Option } from "@/components/ui/CustomSelect";
import { Pagination } from "@/components/ui/Pagination";
import type { SubscriptionStatus } from "@/types";
import {
  useGetAdminSubscriptions,
  useUpdateSubscription,
} from "@/hooks/use-subscription";

const STATUS_OPTIONS: Option<SubscriptionStatus | "All">[] = [
  { label: "All Status", value: "All" },
  { label: "Active", value: "ACTIVE" },
  { label: "Pending", value: "PENDING" },
  { label: "Expired", value: "EXPIRED" },
  { label: "Canceled", value: "CANCELED" },
  { label: "Trial", value: "TRIAL" },
];

const PAGE_SIZE = 10;

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  ACTIVE: { bg: "bg-emerald-100", text: "text-emerald-700" },
  PENDING: { bg: "bg-yellow-100", text: "text-yellow-700" },
  EXPIRED: { bg: "bg-red-100", text: "text-red-700" },
  CANCELED: { bg: "bg-gray-100", text: "text-gray-700" },
  TRIAL: { bg: "bg-blue-100", text: "text-blue-700" },
};

interface SubscriptionsSectionProps {
  search: string;
  onSearchChange: (value: string) => void;
}

interface UpdateTarget {
  uid: string;
  newStatus: SubscriptionStatus;
}

export default function SubscriptionsSection({
  search,
  onSearchChange,
}: SubscriptionsSectionProps) {
  const [statusFilter, setStatusFilter] = useState<SubscriptionStatus | "All">(
    "All"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [updateTarget, setUpdateTarget] = useState<UpdateTarget | null>(null);

  const { data: subscriptionsData, isLoading } = useGetAdminSubscriptions();
  const { mutateAsync: updateSubscription, isPending: isUpdating } =
    useUpdateSubscription();

  const subscriptions = subscriptionsData || [];

  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((sub) => {
      const matchesSearch =
        sub.uid.toLowerCase().includes(search.toLowerCase()) ||
        sub.user?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        sub.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
        sub.plan?.name?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || sub.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [subscriptions, search, statusFilter]);

  const paginatedSubscriptions = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredSubscriptions.slice(start, start + PAGE_SIZE);
  }, [filteredSubscriptions, currentPage]);

  const handleStatusChange = async () => {
    if (!updateTarget) return;
    try {
      await updateSubscription({
        uid: updateTarget.uid,
        status: updateTarget.newStatus,
      });
      setUpdateTarget(null);
    } catch (err) {
      console.error(err);
    }
  };

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
            placeholder="Search by subscription ID, user, plan..."
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
      {paginatedSubscriptions.length > 0 ? (
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
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      Expires
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedSubscriptions.map((sub, idx) => (
                    <motion.tr
                      key={sub.uid}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border-b border-gray-200 hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{sub.id}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={sub.user?.image || "/Sarah.png"}
                            alt={sub.user?.fullName}
                            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                          />
                          <div>
                            <p className="text-sm text-gray-700">
                              {sub.user?.fullName || "Unknown"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {sub.user?.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-700">
                          {sub.plan?.name}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            STATUS_COLORS[sub.status].bg
                          } ${STATUS_COLORS[sub.status].text}`}
                        >
                          {sub.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {sub.expiresAt
                          ? new Date(sub.expiresAt).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() =>
                            setUpdateTarget({
                              uid: sub.uid,
                              newStatus:
                                sub.status === "ACTIVE" ? "CANCELED" : "ACTIVE",
                            })
                          }
                          className="text-sm px-3 py-1 rounded border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
                        >
                          {sub.status === "ACTIVE" ? "Cancel" : "Activate"}
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </div>

          {/* Mobile View */}
          <div className="md:hidden space-y-3">
            {paginatedSubscriptions.map((sub, idx) => (
              <motion.div
                key={sub.uid}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white border border-gray-200 rounded-[4px] p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={sub.user?.image || "/Sarah.png"}
                      alt={sub.user?.fullName}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">
                        {sub.user?.fullName}
                      </p>
                      <p className="text-xs text-gray-500">{sub.user?.email}</p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      STATUS_COLORS[sub.status].bg
                    } ${STATUS_COLORS[sub.status].text}`}
                  >
                    {sub.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">Plan</p>
                    <p className="font-medium text-gray-900">
                      {sub.plan?.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Expires</p>
                    <p className="font-medium text-gray-900">
                        {sub.expiresAt
                          ? new Date(sub.expiresAt).toLocaleDateString()
                          : "N/A"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    setUpdateTarget({
                      uid: sub.uid,
                      newStatus:
                        sub.status === "ACTIVE" ? "CANCELED" : "ACTIVE",
                    })
                  }
                  className="w-full text-sm px-3 py-2 rounded border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
                >
                  {sub.status === "ACTIVE" ? "Cancel" : "Activate"}
                </button>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {filteredSubscriptions.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalItems={filteredSubscriptions.length}
              itemsPerPage={PAGE_SIZE}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      ) : (
        <NotFound title="No subscriptions found." className="mt-8" />
      )}

      {/* Status Update Dialog */}
      <ConfirmDialog
        open={!!updateTarget}
        title={`${
          updateTarget?.newStatus === "CANCELED" ? "Cancel" : "Activate"
        } Subscription`}
        description={`Are you sure you want to ${
          updateTarget?.newStatus === "CANCELED" ? "cancel" : "activate"
        } this subscription? This action can be undone.`}
        confirmLabel={
          updateTarget?.newStatus === "CANCELED"
            ? "Cancel Subscription"
            : "Activate"
        }
        isLoading={isUpdating}
        onConfirm={handleStatusChange}
        onCancel={() => setUpdateTarget(null)}
      />
    </div>
  );
}
