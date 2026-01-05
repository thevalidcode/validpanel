import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Eye, Trash2 } from "lucide-react";
import SearchInput from "@/components/ui/SearchInput";
import { Pagination } from "@/components/ui/Pagination";
import ContactStatusBadge from "./ContactStatusBadge";
import type { ContactMessage, ContactMessageStatus } from "@/types";

const PAGE_SIZE = 10;
const STATUS_FILTERS = ["All", "PENDING", "REPLIED", "RESOLVED"] as const;

interface ContactMessagesListProps {
  messages: ContactMessage[] | undefined;
  isLoading: boolean;
  onViewDetail: (uid: string) => void;
  onDelete: (uid: string) => void;
  isDeleting: boolean;
}

export default function ContactMessagesList({
  messages = [],
  isLoading,
  onViewDetail,
  onDelete,
  isDeleting,
}: ContactMessagesListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState<
    "All" | ContactMessageStatus
  >("All");

  // Filter & search logic
  const filteredMessages = useMemo(() => {
    let filtered = messages;

    // Filter by status
    if (selectedStatus !== "All") {
      filtered = filtered.filter((m) => m.status === selectedStatus);
    }

    // Search by name, email
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.firstName.toLowerCase().includes(query) ||
          m.lastName.toLowerCase().includes(query) ||
          m.email.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [messages, searchQuery, selectedStatus]);

  const totalItems = filteredMessages.length;
  const displayedMessages = filteredMessages.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton */}
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="bg-gray-200 rounded-lg h-20 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Search */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Contact Messages
        </h2>
        <SearchInput
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {/* Status Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-sm font-medium text-gray-700 mb-4">
          Filter by Status
        </p>
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((status) => (
            <button
              key={status}
              onClick={() => {
                setSelectedStatus(status);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                selectedStatus === status
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Table - Desktop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden"
      >
        {displayedMessages.length > 0 ? (
          <>
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Received
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {displayedMessages.map((msg, idx) => (
                  <motion.tr
                    key={msg.uid}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-medium text-gray-900">
                        {msg.firstName} {msg.lastName}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-gray-600 text-sm">{msg.email}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <ContactStatusBadge status={msg.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-gray-600 text-sm">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => onViewDetail(msg.uid)}
                          className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(msg.uid)}
                          disabled={isDeleting}
                          className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete message"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="border-t border-gray-200 px-6 py-4">
              <Pagination
                currentPage={currentPage}
                totalItems={totalItems}
                itemsPerPage={PAGE_SIZE}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No messages found</p>
          </div>
        )}
      </motion.div>

      {/* Messages Cards - Mobile */}
      <div className="md:hidden space-y-4">
        {displayedMessages.length > 0 ? (
          <>
            {displayedMessages.map((msg, idx) => (
              <motion.div
                key={msg.uid}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-lg shadow-md p-4"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      {msg.firstName} {msg.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{msg.email}</p>
                  </div>
                  <ContactStatusBadge status={msg.status} />
                </div>

                <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                  {msg.message}
                </p>

                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onViewDetail(msg.uid)}
                      className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition"
                      title="View details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(msg.uid)}
                      disabled={isDeleting}
                      className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition disabled:opacity-50"
                      title="Delete message"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Mobile Pagination */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <Pagination
                currentPage={currentPage}
                totalItems={totalItems}
                itemsPerPage={PAGE_SIZE}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500">No messages found</p>
          </div>
        )}
      </div>
    </div>
  );
}
