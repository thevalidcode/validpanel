import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, Trash2 } from "lucide-react";
import { Pagination } from "@/components/ui/Pagination";
import { paginate } from "@/utils/paginate";
import type { ContactMessage } from "@/types";
import ContactStatusBadge from "./ContactStatusBadge";

interface ContactMessagesDesktopViewProps {
  messages: ContactMessage[];
  onViewDetail: (uid: string) => void;
  onDelete: (uid: string) => void;
  isDeleting: boolean;
}

export default function ContactMessagesDesktopView({
  messages,
  onViewDetail,
  onDelete,
  isDeleting,
}: ContactMessagesDesktopViewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const { data: paginatedMessages } = paginate(
    messages,
    currentPage,
    itemsPerPage
  );

  return (
    <div className="space-y-4">
      <div className="w-full overflow-x-auto border border-gray-200 rounded-[4px] bg-white">
        <table className="min-w-[1000px] w-full text-sm whitespace-nowrap">
          <thead>
            <tr className="text-left text-gray-600 bg-gray-50 border-b border-gray-200">
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Email</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Received</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedMessages.map((msg, idx) => (
              <motion.tr
                key={msg.uid}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="border-t border-gray-200 hover:bg-gray-50 transition"
              >
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-700 flex-shrink-0">
                      {msg.firstName[0]}
                      {msg.lastName[0]}
                    </div>
                    <span className="font-medium text-gray-900">
                      {msg.firstName} {msg.lastName}
                    </span>
                  </div>
                </td>
                <td className="p-4 text-gray-600">{msg.email}</td>
                <td className="p-4">
                  <ContactStatusBadge status={msg.status} />
                </td>
                <td className="p-4 text-gray-600 text-sm">
                  {new Date(msg.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onViewDetail(msg.uid)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-[4px] transition"
                      title="View message"
                    >
                      <Eye className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onDelete(msg.uid)}
                      disabled={isDeleting}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-[4px] transition disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Delete message"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {paginatedMessages.length === 0 && (
        <div className="text-center py-12 bg-white rounded-[4px] border border-gray-200">
          <p className="text-gray-500">No messages found</p>
        </div>
      )}

      {messages.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={messages.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
