import type { FC, ReactNode } from "react";
import { motion } from "framer-motion";

interface UpgradeGateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  actionLabel?: string;
  onActionClick?: () => void;
  variant?: "inline" | "card" | "page";
}

const UpgradeGate: FC<UpgradeGateProps> = ({
  title,
  description,
  icon,
  actionLabel = "Upgrade Plan",
  onActionClick,
  variant = "card",
}) => {
  const isPage = variant === "page";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={[
        "flex flex-col items-center justify-center text-center m-6",
        "border border-gray-200 shadow-sm rounded-[4px]",
        isPage ? "min-h-[70vh] px-6 bg-white" : "p-6 bg-white",
      ].join(" ")}
    >
      <div className="mb-4">
        {icon ? (
          <div className="text-gray-400">{icon}</div>
        ) : (
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-xl">
            🔒
          </div>
        )}
      </div>

      <h3
        className={[
          "font-semibold text-gray-900",
          isPage ? "text-2xl" : "text-lg",
        ].join(" ")}
      >
        {title}
      </h3>

      {description && (
        <p
          className={[
            "text-gray-500 max-w-md",
            isPage ? "mt-3 text-base" : "mt-2 text-sm",
          ].join(" ")}
        >
          {description}
        </p>
      )}

      {onActionClick && (
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          type="button"
          onClick={onActionClick}
          className="mt-6 inline-flex items-center gap-2 rounded-[4px] bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary/90 transition shadow-sm"
        >
          {actionLabel}
        </motion.button>
      )}
    </motion.div>
  );
};

export default UpgradeGate;
