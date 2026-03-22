import { motion } from "framer-motion";
import { type FC, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";

// Simulating the actual Admin UI components - mimicking typical Dashboard Styles
const FakeInput = ({ label, value }: { label: string; value: string }) => (
  <div className="mb-4">
    <label className="block text-sm text-gray-500 mb-1 font-medium">
      {label}
    </label>
    <div className="w-full bg-white border border-gray-200 rounded-[4px] px-4 py-3 text-gray-700 text-sm focus-within:border-[var(--color-primary)] transition-all">
      {value}
    </div>
  </div>
);

const FakeToggle = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <div
    className="flex items-center justify-between p-4 border border-gray-200 rounded-[4px] bg-white cursor-pointer hover:bg-gray-50 transition-colors"
    onClick={onClick}
  >
    <span className="text-sm font-medium text-gray-700">{label}</span>
    <div
      className={`w-11 h-6 rounded-full relative transition-colors ${active ? "bg-[var(--color-primary)]" : "bg-gray-200"}`}
    >
      <div
        className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${active ? "translate-x-5" : ""}`}
      />
    </div>
  </div>
);

const StoreManagementShowcase: FC = () => {
  const [isActive, setIsActive] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">(
    "idle",
  );

  const handleSave = () => {
    setSaveStatus("saving");
    setTimeout(() => setSaveStatus("saved"), 800);
    setTimeout(() => setSaveStatus("idle"), 2500);
  };

  return (
    <section className="py-32 bg-gray-50 border-y border-gray-200 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-20">
          {/* TEXT SIDE */}
          <div className="lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Complete Control Center
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Your dashboard is a complete command center. Whether you're shipping physical products or fulfilling social media services, manage everything from one unified interface.
            </p>

            <ul className="space-y-4">
              {[
                "Real-time Inventory & Order Sync",
                "Automated Service API Connections",
                "Smart Order Routing",
                "Granular Staff Permissions",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-gray-700 font-medium"
                >
                  <FaCheckCircle className="text-[var(--color-primary)]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* INTERACTIVE UI SIDE - MIMIC REAL PRODUCT */}
          <div className="lg:w-1/2 w-full perspective-1000">
            <motion.div
              initial={{ rotateY: 10, opacity: 0 }}
              whileInView={{ rotateY: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="bg-white rounded-[4px] shadow-2xl border border-gray-200 overflow-hidden max-w-md mx-auto relative"
            >
              {/* Header */}
              <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <span className="font-semibold text-gray-800">
                  Store Settings
                </span>
                <button
                  onClick={handleSave}
                  className="text-xs bg-[var(--color-primary)] text-white px-4 py-2 rounded-[4px] font-medium transition-all hover:bg-opacity-90 active:scale-95"
                >
                  {saveStatus === "idle"
                    ? "Save Changes"
                    : saveStatus === "saving"
                      ? "Saving..."
                      : "Saved!"}
                </button>
              </div>

              {/* Body */}
              <div className="p-6 bg-gray-50/50 space-y-6">
                <FakeInput label="Store Name" value="My Awesome Brand" />

                <div className="grid grid-cols-2 gap-4">
                  <FakeInput label="Currency" value="USD ($)" />
                  <FakeInput label="Timezone" value="UTC-5" />
                </div>

                <div className="space-y-3">
                  <FakeToggle
                    label="Store Publicly Visible"
                    active={isActive}
                    onClick={() => setIsActive(!isActive)}
                  />
                  <FakeToggle
                    label="Accept Notifications"
                    active={true}
                    onClick={() => {}}
                  />
                </div>
              </div>

              {/* Status Bar */}
              <div className="bg-white px-6 py-2 text-xs text-gray-500 border-t border-gray-200 flex justify-between items-center">
                <span>ValidPanel v1.0.0</span>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${isActive ? "bg-green-500" : "bg-orange-500"} animate-pulse`}
                  />
                  <span className="font-medium">
                    {isActive ? "Systems Operational" : "Maintenance Mode"}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoreManagementShowcase;
