import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";
import Loader from "@/components/Loader";
import { useContactMessages, useDeleteContactMessage } from "@/hooks/use-contact-messages";
import ContactMessagesList from "@/admin/components/contact/ContactMessagesList";
import DeleteDialog from "@/components/DeleteDialog";

export default function ContactMessagesPage() {
  const navigate = useNavigate();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedMessageForDelete, setSelectedMessageForDelete] = useState<{
    uid: string;
    senderName: string;
  } | null>(null);

  const { data: messages, isLoading } = useContactMessages();
  const { mutateAsync: deleteMessage, isPending: isDeleting } =
    useDeleteContactMessage();

  const handleViewDetail = (uid: string) => {
    navigate(`/admin/contact-messages/${uid}`);
  };

  const handleDeleteClick = (uid: string, firstName: string, lastName: string) => {
    setSelectedMessageForDelete({
      uid,
      senderName: `${firstName} ${lastName}`,
    });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedMessageForDelete) return;
    await deleteMessage(selectedMessageForDelete.uid);
    setDeleteModalOpen(false);
    setSelectedMessageForDelete(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 rounded-lg">
            <MessageSquare className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
            <p className="text-gray-600">
              Manage customer inquiries and contact submissions
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="bg-white rounded-lg shadow-md p-12 flex justify-center">
          <Loader />
        </div>
      ) : (
        <ContactMessagesList
          messages={messages}
          isLoading={false}
          onViewDetail={handleViewDetail}
          onDelete={(uid) => {
            const message = messages?.find((m) => m.uid === uid);
            if (message) {
              handleDeleteClick(uid, message.firstName, message.lastName);
            }
          }}
          isDeleting={isDeleting}
        />
      )}

      {/* Delete Modal */}
      <DeleteDialog
        open={deleteModalOpen}
        title="Delete Message"
        description={`Are you sure you want to delete this message from ${selectedMessageForDelete?.senderName}? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setSelectedMessageForDelete(null);
        }}
      />
    </motion.div>
  );
}
