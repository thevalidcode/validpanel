import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Shield,
  Store,
  Settings,
  CreditCard,
  Repeat,
} from "lucide-react";
import { useGetPlatformEvents } from "@/hooks/use-admin";
import type { PlatformEvent } from "@/types";

/* ---------------------------------------------
   Icon + color mapping per event category
---------------------------------------------- */
const CATEGORY_META: Record<
  PlatformEvent["category"],
  { icon: React.ElementType; bg: string; text: string }
> = {
  ADMIN: { icon: Shield, bg: "bg-red-100", text: "text-red-700" },
  USER: { icon: User, bg: "bg-blue-100", text: "text-blue-700" },
  STORE: { icon: Store, bg: "bg-purple-100", text: "text-purple-700" },
  SYSTEM: { icon: Settings, bg: "bg-gray-100", text: "text-gray-700" },
  PAYMENT: { icon: CreditCard, bg: "bg-green-100", text: "text-green-700" },
  SUBSCRIPTION: { icon: Repeat, bg: "bg-yellow-100", text: "text-yellow-700" },
};

/* ---------------------------------------------
   Human-readable event formatter
---------------------------------------------- */
const formatEventMessage = (event: PlatformEvent) => {
  const actor = event.admin?.fullName || event.user?.fullName || "System";

  const base = event.event.replace(/_/g, " ").toLowerCase();

  if (base.includes("login")) return `${actor} logged in`;
  if (base.includes("logout")) return `${actor} logged out`;
  if (base.includes("created")) return `${actor} created a new record`;
  if (base.includes("updated")) return `${actor} updated a record`;
  if (base.includes("deleted")) return `${actor} deleted a record`;
  if (base.includes("payment")) return `Payment event triggered by ${actor}`;

  return `${actor}: ${base.charAt(0).toUpperCase()}${base.slice(1)}`;
};

/* ---------------------------------------------
   Component
---------------------------------------------- */
function AdminsActivity() {
  const { data: platformEvents } = useGetPlatformEvents();

  return (
    <div className="rounded-xl bg-white border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold inter">Admin Activity Logs</h2>
        <p className="text-sm text-gray-500">
          Recent administrative actions and system events
        </p>
      </div>

      {/* Content */}
      <div className="p-6">
        <AnimatePresence>
          {!platformEvents || platformEvents.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-gray-500"
            >
              <Settings className="mx-auto mb-3 h-8 w-8 text-gray-400" />
              <p className="text-sm font-medium">No activity recorded yet</p>
              <p className="text-xs">Administrative actions will appear here</p>
            </motion.div>
          ) : (
            <div className="flex flex-col gap-4">
              {platformEvents.map((event) => {
                const meta = CATEGORY_META[event.category];
                const Icon = meta.icon;

                return (
                  <motion.div
                    key={event.uid}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="flex gap-4 p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    {/* Icon */}
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center ${meta.bg}`}
                    >
                      <Icon className={`h-5 w-5 ${meta.text}`} />
                    </div>

                    {/* Content */}
                    <div className="flex flex-col flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {formatEventMessage(event)}
                      </p>
                      <div className="flex gap-2 text-xs text-gray-500">
                        <span>{event.category}</span>
                        <span>•</span>
                        <span>
                          {new Date(event.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default AdminsActivity;
