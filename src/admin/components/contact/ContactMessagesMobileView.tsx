import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, Trash2 } from "lucide-react";
import type { ContactMessage } from "@/types";
import ContactStatusBadge from "./ContactStatusBadge";

interface ContactMessagesMobileViewProps {
  messages: ContactMessage[];
  onViewDetail: (uid: string) => void;
  onDelete: (uid: string) => void;
  isDeleting: boolean;
}

export default function ContactMessagesMobileView({
  messages,
  onViewDetail,
  onDelete,
  isDeleting,
}: ContactMessagesMobileViewProps) {
  const [visibleCount, setVisibleCount] = useState(10);

  const visibleMessages = messages.slice(0, visibleCount);
  const hasMore = visibleCount < messages.length;

  const onHandleLoadMore = () => setVisibleCount((prev) => prev + 10);

  return (
    <div className="mt-6 space-y-4">
      {visibleMessages.map((msg, idx) => (
        <motion.div
          key={msg.uid}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          className="border border-t-4 border-gray-200 rounded-[4px] py-4 px-4 hover:border-blue-600 transition-all flex justify-between items-start shadow-sm"
        >
          <div className="space-y-3 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-700 flex-shrink-0">
                {msg.firstName[0]}
                {msg.lastName[0]}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-900 truncate">
                  {msg.firstName} {msg.lastName}
                </p>
                <p className="text-xs text-gray-500 truncate">{msg.email}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <p className="text-xs text-gray-500">
                  {new Date(msg.createdAt).toLocaleDateString()}
                </p>
                <ContactStatusBadge status={msg.status} />
              </div>
            </div>
          </div>

          <div className="flex gap-2 flex-shrink-0 ml-2">
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
        </motion.div>
      ))}

      {hasMore && (
        <div className="flex justify-center pt-4">
          <button
            onClick={onHandleLoadMore}
            className="px-6 py-2 border border-gray-300 rounded-[4px] text-gray-700 hover:bg-gray-50 transition font-medium text-sm"
          >
            Load More
          </button>
        </div>
      )}

      {visibleMessages.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No messages found</p>
        </div>
      )}
    </div>
  );
}
