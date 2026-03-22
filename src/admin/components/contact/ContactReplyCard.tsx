import { motion } from "framer-motion";
import { Trash2, User, UserCog } from "lucide-react";
import type { ContactReply } from "@/types";
import { useState } from "react";
import DeleteDialog from "@/components/DeleteDialog";

interface ContactReplyCardProps {
  reply: ContactReply;
  onDelete?: (replyUid: string) => void;
  isDeleting?: boolean;
}

export default function ContactReplyCard({
  reply,
  onDelete,
  isDeleting,
}: ContactReplyCardProps) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const isAdmin = reply.sender === "ADMIN";

  const handleDelete = () => {
    if (onDelete) {
      onDelete(reply.uid);
      setDeleteModalOpen(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative ${isAdmin ? "ml-0 mr-8" : "ml-8 mr-0"}`}
      >
        <div
          className={`rounded-[4px] border-2 p-4 ${
            isAdmin
              ? "bg-purple-50 border-purple-200"
              : "bg-gray-50 border-gray-200"
          }`}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isAdmin
                    ? "bg-purple-600 text-white"
                    : "bg-gray-600 text-white"
                }`}
              >
                {isAdmin ? (
                  <UserCog className="w-4 h-4" />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </div>
              <div>
                <p
                  className={`font-semibold text-sm ${
                    isAdmin ? "text-purple-900" : "text-gray-900"
                  }`}
                >
                  {reply.senderName || (isAdmin ? "Support Team" : "Customer")}
                </p>
                {reply.senderEmail && (
                  <p className="text-xs text-gray-600">{reply.senderEmail}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">
                {new Date(reply.createdAt).toLocaleString()}
              </span>
              {onDelete && isAdmin && (
                <button
                  onClick={() => setDeleteModalOpen(true)}
                  disabled={isDeleting}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-[4px] transition disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Delete reply"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          {reply.htmlContent ? (
            <div
              className={`prose prose-sm max-w-none ${
                isAdmin ? "prose-purple" : "prose-gray"
              }`}
              dangerouslySetInnerHTML={{ __html: reply.htmlContent }}
            />
          ) : (
            <p
              className={`text-sm whitespace-pre-wrap break-words ${
                isAdmin ? "text-purple-900" : "text-gray-700"
              }`}
            >
              {reply.content}
            </p>
          )}
        </div>

        {/* Triangle pointer */}
        <div
          className={`absolute top-4 w-0 h-0 border-t-8 border-b-8 border-transparent ${
            isAdmin
              ? "-right-2 border-l-8 border-l-purple-200"
              : "-left-2 border-r-8 border-r-gray-200"
          }`}
        />
      </motion.div>

      {onDelete && (
        <DeleteDialog
          open={deleteModalOpen}
          title="Delete Reply"
          description="Are you sure you want to delete this reply? This action cannot be undone."
          confirmLabel="Delete"
          cancelLabel="Cancel"
          isLoading={isDeleting || false}
          onConfirm={handleDelete}
          onCancel={() => setDeleteModalOpen(false)}
        />
      )}
    </>
  );
}
