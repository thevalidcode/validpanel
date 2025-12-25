import { type FC, type FormEvent, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Shield, Key } from "lucide-react";
import type { Permission } from "@/types";

export type DialogMode = "create" | "edit";

interface PermissionForm {
  name: string;
}

interface EditPermissionDialogProps {
  open: boolean;
  mode: DialogMode;
  initialValues?: Permission;
  isLoading?: boolean;
  onCancel: () => void;
  onSubmit: (data: PermissionForm) => void;
}

const EditPermissionDialog: FC<EditPermissionDialogProps> = ({
  open,
  mode,
  initialValues,
  isLoading = false,
  onCancel,
  onSubmit,
}) => {
  const [form, setForm] = useState<PermissionForm>({
    name: "",
  });

  useEffect(() => {
    if (mode === "edit" && initialValues) {
      setForm({
        name: initialValues.name,
      });
    } else {
      setForm({
        name: "",
      });
    }
  }, [mode, initialValues, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

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
          <motion.form
            onSubmit={handleSubmit}
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full max-w-md rounded-2xl bg-white border border-gray-200 shadow-xl"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  {mode === "create" ? "Create Permission" : "Edit Permission"}
                </h3>
                <p className="text-sm text-gray-500">
                  {mode === "create"
                    ? "Add a new permission"
                    : "Update permission details"}
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-5">
              <Field
                label="Permission Name"
                icon={<Shield className="w-4 h-4" />}
              >
                <input
                  name="name"
                  title="Permission Name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g., VIEW_USERS, CREATE_ORDERS"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </Field>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onCancel}
                disabled={isLoading}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-60"
              >
                {mode === "edit" && isLoading
                  ? "Saving..."
                  : mode === "create" && isLoading
                  ? "Creating..."
                  : mode === "edit"
                  ? "Save Changes"
                  : "Create Permission"}
              </button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditPermissionDialog;

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
        <span className="text-gray-400">{icon}</span>
        {label}
      </label>
      {children}
    </div>
  );
}
