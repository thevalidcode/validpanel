import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Loader from "@/components/Loader";
import { useContactMessage } from "@/hooks/use-contact-messages";
import ContactMessageDetail from "@/admin/components/contact/ContactMessageDetail";

export default function ContactMessageDetailPage() {
  const { uid } = useParams<{ uid: string }>();
  const navigate = useNavigate();

  const { data: message, isLoading } = useContactMessage(uid || "");

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 flex justify-center">
        <Loader />
      </div>
    );
  }

  if (!message) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-lg shadow-md p-8 text-center"
      >
        <p className="text-gray-500 mb-4">Message not found</p>
        <button
          onClick={() => navigate("/admin/contact-messages")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Back to Messages
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <ContactMessageDetail
        uid={message.uid}
        firstName={message.firstName}
        lastName={message.lastName}
        email={message.email}
        message={message.message}
        status={message.status}
        createdAt={message.createdAt}
        updatedAt={message.updatedAt}
        onBack={() => navigate("/admin/contact-messages")}
      />
    </motion.div>
  );
}
