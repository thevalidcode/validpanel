import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, Server, ShoppingCart, User, Bell } from "lucide-react";
import type { NotificationCategory, NotificationType } from "@/types";
import { useGetNotifications } from "@/hooks/use-notification";
import Loader from "@/components/Loader";
import Layout from "../components/Layout";
import NotFound from "@/components/NotFound";

// Map notification categories to icons
const categoryIcons: Record<NotificationCategory, typeof Bell> = {
  SYSTEM: Server,
  PAYMENT: CreditCard,
  SUBSCRIPTION: CreditCard,
  STORE: ShoppingCart,
  USER: User,
};

// Map types to background colors
const typeColors: Record<NotificationType, string> = {
  SUBSCRIPTION_PAYMENT: "bg-blue-100 text-blue-600",
  SUBSCRIPTION_UPGRADE: "bg-green-100 text-green-600",
  SUBSCRIPTION_DOWNGRADE: "bg-yellow-100 text-yellow-600",
  SUBSCRIPTION_RENEWAL: "bg-purple-100 text-purple-600",
  SUBSCRIPTION_EXPIRED: "bg-red-100 text-red-600",
  STORE_APPROVED: "bg-green-100 text-green-600",
  STORE_REJECTED: "bg-red-100 text-red-600",
  STORE_CREATED: "bg-blue-100 text-blue-600",
  MANUAL_CREDIT: "bg-green-100 text-green-600",
  MANUAL_DEBIT: "bg-red-100 text-red-600",
};

const AdminNotifications = () => {
  const { data: notifications = [], isLoading } = useGetNotifications();
  if (isLoading) {
    return <Loader />;
  }

  if (notifications.length === 0) {
    return (
      <Layout title="Notifications" description="View admin notifications">
        <NotFound
          title="No notifications found."
          variant="card"
          className="m-6"
        />
      </Layout>
    );
  }

  return (
    <Layout title="Notifications" description="View admin notifications">
      <div className="p-6">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-white border border-gray-200 rounded-[4px] shadow-lg overflow-hidden"
          >
            <ul className="divide-y divide-gray-100 max-h-[70vh] overflow-y-auto">
              {notifications.map((notif) => {
                const Icon = categoryIcons[notif.category];
                const typeColor =
                  typeColors[notif.meta.type] || "bg-gray-100 text-gray-600";

                return (
                  <motion.li
                    key={notif.uid}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-start gap-3 p-4 hover:bg-gray-50 cursor-pointer transition"
                  >
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-[4px] flex items-center justify-center ${typeColor}`}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 truncate">
                        {notif.title}
                      </p>
                      <p className="text-gray-500 text-xs truncate mt-1">
                        {notif.message}
                      </p>
                      <p className="text-gray-400 text-[10px] mt-1">
                        {new Date(notif.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>
    </Layout>
  );
};

export default AdminNotifications;
