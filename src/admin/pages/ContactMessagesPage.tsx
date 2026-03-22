import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import Layout from "@/admin/components/Layout";
import Loader from "@/components/Loader";
import CustomSelect, { type Option } from "@/components/ui/CustomSelect";
import NotFound from "@/components/NotFound";
import {
  useContactMessages,
  useDeleteContactMessage,
} from "@/hooks/use-contact";
import ContactMessagesMobileView from "@/admin/components/contact/ContactMessagesMobileView";
import ContactMessagesDesktopView from "@/admin/components/contact/ContactMessagesDesktopView";
import DeleteDialog from "@/components/DeleteDialog";
import type { ContactMessage, ContactMessageStatus } from "@/types";

export default function ContactMessagesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<
    "All" | ContactMessageStatus
  >("All");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedMessageForDelete, setSelectedMessageForDelete] = useState<{
    uid: string;
    senderName: string;
  } | null>(null);

  const { data: messages, isLoading } = useContactMessages();
  const { mutateAsync: deleteMessage, isPending: isDeleting } =
    useDeleteContactMessage();

  const statusOptions: Option<"All" | ContactMessageStatus>[] = [
    { label: "All Status", value: "All" },
    { label: "Pending", value: "PENDING" },
    { label: "Replied", value: "REPLIED" },
    { label: "Resolved", value: "RESOLVED" },
  ];

  const filteredMessages = useMemo(() => {
    let filtered = (messages || []) as ContactMessage[];

    // Filter by status
    if (selectedStatus !== "All") {
      filtered = filtered.filter(
        (m: ContactMessage) => m.status === selectedStatus
      );
    }

    // Search by name or email
    if (search.trim()) {
      const query = search.toLowerCase();
      filtered = filtered.filter(
        (m: ContactMessage) =>
          m.firstName.toLowerCase().includes(query) ||
          m.lastName.toLowerCase().includes(query) ||
          m.email.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [messages, search, selectedStatus]);

  const handleViewDetail = (uid: string) => {
    navigate(`/admin/contact-messages/${uid}`);
  };

  const handleDeleteClick = (
    uid: string,
    firstName: string,
    lastName: string
  ) => {
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

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Layout
      title="Contact Messages"
      description="Manage customer inquiries and contact submissions."
    >
      <div className="py-5 px-6 w-full">
        {/* Filters */}
        <div className="flex w-full flex-col md:flex-row md:items-center gap-3 bg-white px-5 py-3 rounded-[4px] border border-gray-200">
          <div className="md:w-[75%] w-full flex flex-wrap md:flex-nowrap gap-2 items-center">
            <div className="relative w-full md:w-[60%]">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 border border-gray-200 outline-0 w-full h-full rounded-[4px] pr-3 pl-12 py-2 focus:ring-1 focus:ring-primary"
              />
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            </div>

            <CustomSelect
              options={statusOptions}
              value={statusOptions.find((opt) => opt.value === selectedStatus)}
              placeholder="Status"
              onChange={(selected) => {
                setSelectedStatus(
                  (selected as Option<"All" | ContactMessageStatus>).value
                );
              }}
              className="flex-1"
            />
          </div>
        </div>

        {/* Messages List */}
        {filteredMessages.length ? (
          <div className="mt-5">
            <div className="md:hidden w-full">
              <ContactMessagesMobileView
                messages={filteredMessages}
                onViewDetail={handleViewDetail}
                onDelete={(uid) => {
                  const message = filteredMessages.find((m) => m.uid === uid);
                  if (message) {
                    handleDeleteClick(uid, message.firstName, message.lastName);
                  }
                }}
                isDeleting={isDeleting}
              />
            </div>
            <div className="hidden md:block">
              <ContactMessagesDesktopView
                messages={filteredMessages}
                onViewDetail={handleViewDetail}
                onDelete={(uid) => {
                  const message = filteredMessages.find((m) => m.uid === uid);
                  if (message) {
                    handleDeleteClick(uid, message.firstName, message.lastName);
                  }
                }}
                isDeleting={isDeleting}
              />
            </div>
          </div>
        ) : (
          <NotFound title="No messages found." className="mt-5" />
        )}
      </div>

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
    </Layout>
  );
}
