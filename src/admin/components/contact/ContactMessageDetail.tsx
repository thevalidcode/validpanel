import { useState } from "react";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import CustomSelect, { type Option } from "@/components/ui/CustomSelect";
import type { ContactMessageStatus } from "@/types";
import { useDeleteContactMessage, useUpdateContactStatus } from "@/hooks/use-contact-messages";
import ContactStatusBadge from "./ContactStatusBadge";
import DeleteDialog from "@/components/DeleteDialog";

interface ContactMessageDetailProps {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  status: ContactMessageStatus;
  createdAt: string;
  updatedAt: string;
  onBack: () => void;
}

const STATUS_OPTIONS: Option<ContactMessageStatus>[] = [
  { label: "Pending", value: "PENDING" },
  { label: "Replied", value: "REPLIED" },
  { label: "Resolved", value: "RESOLVED" },
];

export default function ContactMessageDetail({
  uid,
  firstName,
  lastName,
  email,
  message,
  status,
  createdAt,
  updatedAt,
  onBack,
}: ContactMessageDetailProps) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const { mutateAsync: updateStatus, isPending: isUpdating } =
    useUpdateContactStatus();
  const { mutateAsync: deleteMessage, isPending: isDeleting } =
    useDeleteContactMessage();

  const handleStatusChange = async (option: Option<ContactMessageStatus> | Option<ContactMessageStatus>[]) => {
    if (Array.isArray(option)) return;
    await updateStatus({ uid, data: { status: option.value } });
  };

  const handleDelete = async () => {
    await deleteMessage(uid);
    onBack();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {firstName} {lastName}
            </h2>
            <p className="text-gray-600">{email}</p>
          </div>
          <button
            onClick={onBack}
            className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition text-sm font-medium w-full sm:w-auto"
          >
            ← Back
          </button>
        </div>

        {/* Status & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-4 border-t border-gray-200">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <div className="w-full sm:w-48">
              <CustomSelect
                options={STATUS_OPTIONS}
                value={STATUS_OPTIONS.find((s) => s.value === status)}
                onChange={handleStatusChange}
                disabled={isUpdating}
              />
            </div>
          </div>

          <div className="flex gap-2 sm:mt-6">
            <a
              href={`mailto:${email}`}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium text-center"
            >
              Reply via Email
            </a>
            <button
              onClick={() => setDeleteModalOpen(true)}
              disabled={isDeleting}
              className="px-4 py-2 border border-red-200 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              title="Delete message"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Message Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Message</h3>
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-gray-700 whitespace-pre-wrap break-words leading-relaxed">
            {message}
          </p>
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Received
            </p>
            <p className="text-sm text-gray-900 font-medium">
              {new Date(createdAt).toLocaleDateString()}
            </p>
            <p className="text-xs text-gray-500">
              {new Date(createdAt).toLocaleTimeString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Updated
            </p>
            <p className="text-sm text-gray-900 font-medium">
              {new Date(updatedAt).toLocaleDateString()}
            </p>
            <p className="text-xs text-gray-500">
              {new Date(updatedAt).toLocaleTimeString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Status
            </p>
            <div className="mt-1">
              <ContactStatusBadge status={status} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Delete Modal */}
      <DeleteDialog
        open={deleteModalOpen}
        title="Delete Message"
        description={`Are you sure you want to delete this message from ${firstName} ${lastName}? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </motion.div>
  );
}
