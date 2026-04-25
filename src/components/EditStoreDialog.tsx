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
import ImageUploadBox from "@/components/ImageUploadBox";
import ColorPicker from "./ColorPicker";
import { useGetUserActiveSubscription } from "@/hooks/use-subscription";

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
  resellingEnabled: boolean;
}

const EditStoreDialog: FC<EditStoreDialogProps> = ({
  open,
  initialValues,
  isLoading = false,
  onCancel,
  onSubmit,
}) => {
  const { data: activeSubscription } = useGetUserActiveSubscription();
  const canUseReselling = Boolean(
    activeSubscription?.plan?.features?.reselling,
  );

  const [form, setForm] = useState<EditStoreForm>({
    name: "",
    description: "",
    logoUrl: "",
    color: "",
    resellingEnabled: false,
  });

  useEffect(() => {
    if (!initialValues) return;

    setForm({
      name: initialValues.name ?? "",
      description: initialValues.description ?? "",
      logoUrl: initialValues.logoUrl ?? "",
      color: initialValues.color ?? "",
      resellingEnabled: initialValues.resellingEnabled ?? false,
    });
  }, [initialValues]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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
          onClick={onCancel}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full max-w-xl rounded-[4px] bg-white border border-gray-200 shadow-xl flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200 flex-shrink-0">
              <div className="w-10 h-10 rounded-[4px] bg-primary/10 text-primary flex items-center justify-center">
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
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
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
                  className="mt-1 w-full rounded-[4px] border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition disabled:opacity-60 disabled:cursor-not-allowed"
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
                  className="mt-1 w-full rounded-[4px] border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition disabled:opacity-60 disabled:cursor-not-allowed"
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

              {/* Reseller Section */}
              {canUseReselling && (
                <div className="pt-2">
                  <div className="rounded-[4px] border border-primary/20 bg-primary/[0.06] p-4 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                        <span className="text-lg">🚀</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          Enable Reselling
                        </p>
                        <p className="mt-1 text-sm text-gray-700">
                          Enable reselling so other users can resell your
                          products and services, and you earn money from each
                          purchase.
                        </p>
                      </div>
                    </div>

                    <div className="rounded-[4px] border border-primary/25 bg-white px-3 py-2">
                      <p className="text-xs font-medium uppercase tracking-wide text-primary">
                        Note
                      </p>
                      <p className="mt-1 text-sm text-gray-700">
                        Please note that we verify all new resellers for the
                        legitimacy of their business before approval.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          resellingEnabled: !prev.resellingEnabled,
                        }))
                      }
                      className={`w-full py-2.5 px-3 rounded-[4px] text-sm font-medium transition flex items-center justify-center gap-2 ${
                        form.resellingEnabled
                          ? "bg-primary text-white hover:bg-primary/90"
                          : "bg-white border border-primary/30 text-primary hover:bg-primary/5"
                      }`}
                    >
                      {form.resellingEnabled ? (
                        <>
                          <span>✓</span>
                          Reselling Enabled
                        </>
                      ) : (
                        "Enable Reselling"
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 flex-shrink-0 bg-white">
              <button
                type="button"
                onClick={onCancel}
                disabled={isLoading}
                className="rounded-[4px] border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="rounded-[4px] bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-60"
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
