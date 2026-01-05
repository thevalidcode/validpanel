import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Loader from "@/components/Loader";
import { useContactMessage } from "@/hooks/use-contact";
import ContactMessageDetail from "@/admin/components/contact/ContactMessageDetail";
import Layout from "../components/Layout";
import NotFound from "@/components/NotFound";

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
      <Layout
        title="Messages"
        description="Manage customer inquiries and contact submissions."
      >
        <div className="py-5 px-6 w-full">
          <NotFound title="No message found." className="mt-5" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      title="Contact Messages"
      description="Manage customer inquiries and contact submissions."
    >
      <div className="py-5 px-6 w-full">
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
      </div>
    </Layout>
  );
}
