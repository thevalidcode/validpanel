import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useGetUserSettings } from "@/hooks/use-setting";
import { useAppContext } from "@/context/useAppContext";
import { AlertCircle, Clock, MessageSquare } from "lucide-react";
import Loader from "./Loader";

interface MaintenanceModeProps {
  children: React.ReactNode;
}

export default function MaintenanceMode({ children }: MaintenanceModeProps) {
  const { adminInfo } = useAppContext();
  const { data: settingsData, isLoading } = useGetUserSettings();
  const [userIp, setUserIp] = useState<string>("");
  const [timeRemaining, setTimeRemaining] = useState<string>("");

  // Fetch user's IP address
  useEffect(() => {
    const fetchIp = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        setUserIp(data.ip);
      } catch (error) {
        console.error("Failed to fetch IP:", error);
      }
    };
    fetchIp();
  }, []);

  // Calculate time remaining
  useEffect(() => {
    if (!settingsData?.maintenanceEnd) return;

    const calculateRemaining = () => {
      const endTime = new Date(settingsData.maintenanceEnd).getTime();
      const now = new Date().getTime();
      const diff = endTime - now;

      if (diff <= 0) {
        setTimeRemaining("Maintenance should be complete");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setTimeRemaining(`${days}d ${hours}h ${minutes}m remaining`);
      } else if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m remaining`);
      } else {
        setTimeRemaining(`${minutes}m remaining`);
      }
    };

    calculateRemaining();
    const interval = setInterval(calculateRemaining, 60000);
    return () => clearInterval(interval);
  }, [settingsData?.maintenanceEnd]);

  // Check if maintenance mode is enabled and user is not whitelisted
  const isMaintenanceEnabled = settingsData?.maintenanceMode === "ENABLED";

  const isUserWhitelisted =
    userIp &&
    settingsData?.allowedIps &&
    Array.isArray(settingsData.allowedIps) &&
    settingsData.allowedIps.length > 0 &&
    settingsData.allowedIps.includes(userIp);

  // Admins are always excluded from maintenance mode
  const isAdmin = !!adminInfo?.uid;
  const shouldShowMaintenance =
    isMaintenanceEnabled && !isUserWhitelisted && !isAdmin;

  if (isLoading) {
    return <Loader />;
  }

  if (!shouldShowMaintenance) {
    return <>{children}</>;
  }

  const startDate = new Date(settingsData.maintenanceStart);
  const endDate = new Date(settingsData.maintenanceEnd);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        {/* Main Card */}
        <div className="bg-white rounded-[4px] border border-gray-200 shadow-lg overflow-hidden">
          {/* Header */}
          <div className="px-6 md:px-8 py-8 md:py-10 text-center border-b border-gray-200 bg-gray-50">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-flex items-center justify-center mb-4"
            >
              <div className="w-16 h-16 rounded-[4px] bg-primary/10 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-primary" />
              </div>
            </motion.div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Scheduled Maintenance
            </h1>
            <p className="text-gray-600">
              We're upgrading our platform to serve you better
            </p>
          </div>

          {/* Content */}
          <div className="px-6 md:px-8 py-8 md:py-10 space-y-6">
            {/* Time Remaining */}
            {timeRemaining && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-primary/5 border border-primary/20 rounded-[4px] p-4 flex items-start gap-3"
              >
                <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Time Remaining
                  </p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    {timeRemaining}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Maintenance Schedule */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
                Maintenance Schedule
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {/* Start Date */}
                <div className="bg-gray-50 rounded-[4px] p-4 border border-gray-200">
                  <p className="text-xs font-medium text-gray-600 mb-2">
                    Start Time
                  </p>
                  <p className="text-base font-semibold text-gray-900">
                    {startDate.toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {startDate.toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                </div>

                {/* End Date */}
                <div className="bg-gray-50 rounded-[4px] p-4 border border-gray-200">
                  <p className="text-xs font-medium text-gray-600 mb-2">
                    End Time
                  </p>
                  <p className="text-base font-semibold text-gray-900">
                    {endDate.toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {endDate.toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Maintenance Message */}
            {settingsData?.maintenanceMsg && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gray-50 border border-gray-200 rounded-[4px] p-4"
              >
                <div className="flex gap-3">
                  <MessageSquare className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                      Message
                    </p>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {settingsData.maintenanceMsg}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Info Box */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-primary/5 border border-primary/20 rounded-[4px] p-4"
            >
              <p className="text-sm text-gray-700">
                We appreciate your patience. During this time, the platform will
                be temporarily unavailable. We'll be back soon with
                improvements!
              </p>
            </motion.div>
          </div>

          {/* Footer */}
          <div className="px-6 md:px-8 py-4 bg-gray-50 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-600">
              Need help? Contact us at{" "}
              <a href="mailto:support@validpanel.com">support@validpanel.com</a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
