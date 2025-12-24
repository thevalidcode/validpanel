import type { FC } from "react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Store } from "@/types";
import {
  Store as StoreIcon,
  AlignLeft,
  ImageIcon,
  Palette,
} from "lucide-react";
import ColorPicker from "@/components/ColorPicker";
import ImageUploadBox from "@/components/ImageUploadBox";

interface EditStoreDialogProps {
  open: boolean;
  initialValues?: Store;
  isLoading?: boolean;
  onCancel: () => void;
  onSubmit: (data: Partial<EditStoreForm>) => void;
}

interface EditStoreForm {
  name: string;
  description: string;
  logoUrl: string;
  color: string;
}

const EditStoreDialog: FC<EditStoreDialogProps> = ({
  open,
  initialValues,
  isLoading = false,
  onCancel,
  onSubmit,
}) => {
  const [form, setForm] = useState<EditStoreForm>({
    name: "",
    description: "",
    logoUrl: "",
    color: "",
  });

  useEffect(() => {
    if (!initialValues) return;

    setForm({
      name: initialValues.name ?? "",
      description: initialValues.description ?? "",
      logoUrl: initialValues.logoUrl ?? "",
      color: initialValues.color ?? "",
    });
  }, [initialValues]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSubmit(form);
    onCancel();
  };

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
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full max-w-xl rounded-2xl bg-white border border-gray-200 shadow-xl"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <StoreIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Edit Store
                </h3>
                <p className="text-sm text-gray-500">
                  Update store details and branding
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-5">
              {/* Store name */}
              <Field
                icon={<StoreIcon className="w-4 h-4" />}
                label="Store name"
              >
                <input
                  name="name"
                  title="name"
                  value={form.name}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </Field>

              {/* Description */}
              <Field
                icon={<AlignLeft className="w-4 h-4" />}
                label="Description"
              >
                <textarea
                  name="description"
                  title="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </Field>

              {/* Logo */}

              <ImageUploadBox
                collection="store"
                variant="box"
                labelIcon={<ImageIcon className="w-4 h-4" />}
                buttonLabel="Upload New Logo"
                label="Logo"
                description="JPG, PNG or GIF. Max size 2MB."
                onUploaded={(url) =>
                  setForm((prev) => ({ ...prev, logoUrl: url }))
                }
              />

              {/* Brand color */}
              <Field icon={<Palette className="w-4 h-4" />} label="Brand color">
                <ColorPicker
                  selectedColor={form.color}
                  setSelectedColor={(color) =>
                    setForm((prev) => ({ ...prev, color }))
                  }
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
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-60"
              >
                {isLoading ? "Saving..." : "Save changes"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditStoreDialog;

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
