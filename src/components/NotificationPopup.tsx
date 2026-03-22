import { type FC, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  type LucideIcon,
  CreditCard,
  Server,
  ShoppingCart,
  User,
  CheckCircle,
} from "lucide-react";
import type {
  Notification,
  NotificationCategory,
  NotificationType,
} from "@/types";
import { useMarkNotificationAsRead } from "@/hooks/use-notification";

interface NotificationPopupProps {
  open: boolean;
  notifications: Notification[];
  onClose: () => void;
  type?: "user" | "admin"; // New prop
}

const categoryIcons: Record<NotificationCategory, LucideIcon> = {
  SYSTEM: Server,
  PAYMENT: CreditCard,
  SUBSCRIPTION: CreditCard,
  STORE: ShoppingCart,
  USER: User,
};

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

const NotificationPopup: FC<NotificationPopupProps> = ({
  open,
  notifications,
  onClose,
  type = "user",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { mutate: markAsRead } = useMarkNotificationAsRead();

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onClose]);

  const isAdmin = type === "admin";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex justify-end p-4 pointer-events-none"
        >
          <motion.div
            ref={containerRef}
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto h-fit w-full max-w-sm sm:max-w-md bg-white rounded-[4px] shadow-lg border border-gray-200 overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <h4 className="font-semibold text-gray-900 text-sm">
                Notifications
              </h4>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                ×
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto divide-y divide-gray-100">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500 text-sm">
                  No notifications
                </div>
              ) : (
                notifications.map((notif) => {
                  const Icon = categoryIcons[notif.category];
                  const typeColor =
                    typeColors[notif.meta.type] || "bg-gray-100 text-gray-600";

                  return (
                    <motion.div
                      key={notif.uid}
                      layout
                      className={`flex items-start gap-3 p-4 hover:bg-gray-50 cursor-pointer transition`}
                      onClick={() => {
                        if (!isAdmin) markAsRead(notif.uid); // only user
                        onClose();
                      }}
                    >
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-[4px] flex items-center justify-center ${
                          isAdmin
                            ? typeColor
                            : notif.isRead
                            ? "bg-gray-200"
                            : typeColor
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 ${
                            isAdmin
                              ? "text-white"
                              : notif.isRead
                              ? "text-gray-500"
                              : "text-white"
                          }`}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p
                          className={`font-medium text-sm truncate ${
                            isAdmin
                              ? "text-gray-900"
                              : notif.isRead
                              ? "text-gray-700"
                              : "text-gray-900"
                          }`}
                        >
                          {notif.title}
                        </p>
                        <p className="text-gray-500 text-xs truncate mt-1">
                          {notif.message}
                        </p>
                        <p className="text-gray-400 text-[10px] mt-1">
                          {new Date(notif.createdAt).toLocaleString()}
                        </p>
                      </div>

                      {!isAdmin && !notif.isRead && (
                        <CheckCircle className="w-4 h-4 text-primary mt-1" />
                      )}
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationPopup;
