import type { FC, ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  icon?: ReactNode;

  confirmLabel?: string;
  cancelLabel?: string;

  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: FC<ConfirmDialogProps> = ({
  open,
  title,
  description,
  icon,
  confirmLabel = "Continue",
  cancelLabel = "Cancel",
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="w-full max-w-md rounded-[4px] bg-white border border-gray-200 shadow-xl p-6 text-center"
          >
            <div className="mb-4">
              {icon ? (
                <div className="flex items-center justify-center text-primary">
                  {icon}
                </div>
              ) : (
                <div className="w-16 h-16 mx-auto rounded-full bg-red-100 flex items-center justify-center text-red-600 text-2xl">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-8 h-8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                    />
                  </svg>
                </div>
              )}
            </div>

            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>

            {description && (
              <p className="mt-2 text-sm text-gray-500">{description}</p>
            )}

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={onCancel}
                disabled={isLoading}
                className="inline-flex items-center rounded-[4px] border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-60"
              >
                {cancelLabel}
              </button>

              <button
                type="button"
                onClick={onConfirm}
                disabled={isLoading}
                className="inline-flex items-center rounded-[4px] bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition disabled:opacity-60 shadow-md shadow-purple-500/20"
              >
                {isLoading ? "Please wait..." : confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialog;
