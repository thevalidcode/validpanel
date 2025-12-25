import type { FC, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DeleteDialogProps {
  open: boolean;
  title?: string;
  description?: string;
  icon?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteDialog: FC<DeleteDialogProps> = ({
  open,
  title = "Confirm delete",
  description = "This action cannot be undone. Are you sure you want to continue?",
  icon,
  confirmLabel = "Delete",
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
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="w-full max-w-md rounded-xl bg-white border border-gray-200 shadow-xl p-6 text-center"
          >
            <div className="mb-4">
              {icon ? (
                <div className="w-14 h-14 mx-auto rounded-full bg-red-50 flex items-center justify-center text-red-500 text-xl">
                  {icon}
                </div>
              ) : (
                <div className="w-14 h-14 mx-auto rounded-full bg-red-50 flex items-center justify-center text-red-500 text-xl">
                  !
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
                className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-60"
              >
                {cancelLabel}
              </button>

              <button
                type="button"
                onClick={onConfirm}
                disabled={isLoading}
                className="inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition disabled:opacity-60"
              >
                {isLoading ? "Deleting..." : confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteDialog;
