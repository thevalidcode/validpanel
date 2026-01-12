import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowLeft, Mail, Trash2 } from "lucide-react";
import Loader from "@/components/Loader";
import {
  useContactMessage,
  useUpdateContactStatus,
  useDeleteContactMessage,
  useSendContactReply,
  useDeleteContactReply,
} from "@/hooks/use-contact";
import Layout from "../components/Layout";
import NotFound from "@/components/NotFound";
import ContactReplyCard from "@/admin/components/contact/ContactReplyCard";
import ContactReplyForm from "@/admin/components/contact/ContactReplyForm";
import DeleteDialog from "@/components/DeleteDialog";
import CustomSelect, { type Option } from "@/components/ui/CustomSelect";
import type { ContactMessageStatus } from "@/types";

const STATUS_OPTIONS: Option<ContactMessageStatus>[] = [
  { label: "Pending", value: "PENDING" },
  { label: "Replied", value: "REPLIED" },
  { label: "Resolved", value: "RESOLVED" },
  { label: "Closed", value: "CLOSED" },
];

export default function ContactMessageDetailPage() {
  const { uid } = useParams<{ uid: string }>();
  const navigate = useNavigate();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingReplyUid, setDeletingReplyUid] = useState<string | null>(null);

  const { data: message, isLoading } = useContactMessage(uid || "");
  const { mutateAsync: updateStatus, isPending: isUpdatingStatus } =
    useUpdateContactStatus();
  const { mutateAsync: deleteMessage, isPending: isDeletingMessage } =
    useDeleteContactMessage();
  const { mutateAsync: sendReply, isPending: isSendingReply } =
    useSendContactReply(uid || "");
  const { mutateAsync: deleteReply, isPending: isDeletingReply } =
    useDeleteContactReply(uid || "");

  if (isLoading) {
    return (
      <Layout
        title="Contact Message"
        description="View and reply to customer inquiries."
      >
        <div className="py-5 px-6 w-full">
          <div className="bg-white rounded-lg shadow-md p-12 flex justify-center">
            <Loader />
          </div>
        </div>
      </Layout>
    );
  }

  if (!message) {
    return (
      <Layout
        title="Contact Message"
        description="View and reply to customer inquiries."
      >
        <div className="py-5 px-6 w-full">
          <NotFound title="No message found." className="mt-5" />
        </div>
      </Layout>
    );
  }

  const handleStatusChange = async (
    option: Option<ContactMessageStatus> | Option<ContactMessageStatus>[]
  ) => {
    if (Array.isArray(option)) return;
    await updateStatus({ uid: message.uid, data: { status: option.value } });
  };

  const handleDelete = async () => {
    await deleteMessage(message.uid);
    navigate("/admin/contact-messages");
  };

  const handleSendReply = async (replyMessage: string) => {
    await sendReply({ message: replyMessage });
  };

  const handleDeleteReply = async (replyUid: string) => {
    await deleteReply(replyUid);
    setDeletingReplyUid(null);
  };

  const replies = message.replies || [];
  const sortedReplies = [...replies].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  return (
    <Layout
      title="Contact Message"
      description="View and reply to customer inquiries."
    >
      <div className="py-5 px-6 w-full max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <button
            onClick={() => navigate("/admin/contact-messages")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Messages
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Ticket #{message.id}
          </h1>
        </motion.div>

        {/* Customer Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-bold text-lg">
                {message.firstName[0]}
                {message.lastName[0]}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {message.firstName} {message.lastName}
                </h2>
                <a
                  href={`mailto:${message.email}`}
                  className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700 transition"
                >
                  <Mail className="w-3.5 h-3.5" />
                  {message.email}
                </a>
              </div>
            </div>

            <button
              onClick={() => setDeleteModalOpen(true)}
              disabled={isDeletingMessage}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              title="Delete ticket"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          {/* Status & Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Status
              </label>
              <CustomSelect
                options={STATUS_OPTIONS}
                value={STATUS_OPTIONS.find((s) => s.value === message.status)}
                onChange={handleStatusChange}
                disabled={isUpdatingStatus}
              />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Received
              </p>
              <p className="text-sm text-gray-900 font-medium">
                {new Date(message.createdAt).toLocaleDateString()}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(message.createdAt).toLocaleTimeString()}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Replies
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {replies.length}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Original Message */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border-2 border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-gray-600 text-white flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Original Message</p>
                <p className="text-xs text-gray-500">
                  {new Date(message.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            <p className="text-gray-700 whitespace-pre-wrap break-words leading-relaxed">
              {message.message}
            </p>
          </div>
        </motion.div>

        {/* Conversation Thread */}
        {sortedReplies.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6 space-y-4"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Conversation ({replies.length})
            </h3>
            {sortedReplies.map((reply, index) => (
              <motion.div
                key={reply.uid}
                initial={{ opacity: 0, x: reply.sender === "ADMIN" ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ContactReplyCard
                  reply={reply}
                  onDelete={handleDeleteReply}
                  isDeleting={isDeletingReply && deletingReplyUid === reply.uid}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Reply Form */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4">Send Reply</h3>
          <ContactReplyForm
            onSubmit={handleSendReply}
            isLoading={isSendingReply}
          />
        </motion.div>

        {/* Delete Ticket Dialog */}
        <DeleteDialog
          open={deleteModalOpen}
          title="Delete Ticket"
          description={`Are you sure you want to delete this ticket from ${message.firstName} ${message.lastName}? This will also delete all replies. This action cannot be undone.`}
          confirmLabel="Delete Ticket"
          cancelLabel="Cancel"
          isLoading={isDeletingMessage}
          onConfirm={handleDelete}
          onCancel={() => setDeleteModalOpen(false)}
        />
      </div>
    </Layout>
  );
}
