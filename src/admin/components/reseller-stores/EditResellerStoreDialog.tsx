import { type FC, type FormEvent, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { ResellerStore, StoreType } from "@/types";
import CustomSelect, { type Option } from "@/components/ui/CustomSelect";
import { ImageIcon, StoreIcon } from "lucide-react";
import ImageUploadBox from "@/components/ImageUploadBox";
import CustomCheckbox from "@/components/ui/CustomCheckbox";

type DialogMode = "create" | "edit";

export interface ResellerStoreSubmitData {
  name: string;
  url: string;
  image?: string | null;
  type?: StoreType;
  isActive: boolean;
}

interface EditResellerStoreDialogProps {
  open: boolean;
  mode: DialogMode;
  initialValues?: ResellerStore;
  isLoading?: boolean;
  onCancel: () => void;
  onSubmit: (data: ResellerStoreSubmitData) => void;
}

const typeOptions: Option<StoreType>[] = [
  { label: "Shop", value: "SHOP" },
  { label: "Social Media Store", value: "SOCIAL" },
  { label: "Digital", value: "DIGITAL" },
];

const EditResellerStoreDialog: FC<EditResellerStoreDialogProps> = ({
  open,
  mode,
  initialValues,
  isLoading = false,
  onCancel,
  onSubmit,
}) => {
  const [form, setForm] = useState<ResellerStoreSubmitData>({
    name: "",
    url: "",
    image: "",
    type: "SHOP",
    isActive: true,
  });

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && initialValues) {
      setForm({
        name: initialValues.name,
        url: initialValues.url,
        image: initialValues.image || "",
        type: initialValues.type,
        isActive: initialValues.isActive,
      });
      return;
    }

    setForm({
      name: "",
      url: "",
      image: "",
      type: "SHOP",
      isActive: true,
    });
  }, [open, mode, initialValues]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit({
      name: form.name.trim(),
      url: form.url.trim(),
      image: form.image?.trim() || null,
      type: form.type,
      isActive: form.isActive,
    });
  };

  if (!open) return null;

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
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full max-w-xl rounded-[4px] bg-white border border-gray-200 shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200 flex-shrink-0">
              <div className="w-10 h-10 rounded-[4px] bg-primary/10 text-primary flex items-center justify-center">
                <StoreIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {mode === "create"
                    ? "Create Reseller Store"
                    : "Edit Reseller Store"}
                </h3>
                <p className="text-sm text-gray-500">
                  Keep entries accurate for reseller source discovery.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  title="name"
                  required
                  value={form.name}
                  placeholder="Test Store"
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full rounded-[4px] border border-gray-300 px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL
                </label>
                <input
                  type="text"
                  title="url"
                  required
                  value={form.url}
                  placeholder="teststore.validpanel.com/v2"
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, url: e.target.value }))
                  }
                  className="w-full rounded-[4px] border border-gray-300 px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                />
              </div>

              <div>
                <ImageUploadBox
                  collection="store"
                  variant="box"
                  labelIcon={<ImageIcon className="w-4 h-4" />}
                  buttonLabel="Upload Image"
                  label="Image"
                  description="JPG, PNG or GIF. Max size 2MB."
                  onUploaded={(url) =>
                    setForm((prev) => ({ ...prev, image: url }))
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <CustomSelect
                  options={typeOptions}
                  value={typeOptions.find(
                    (option) => option.value === form.type,
                  )}
                  onChange={(selected) =>
                    setForm((prev) => ({
                      ...prev,
                      type: (selected as Option<StoreType>).value,
                    }))
                  }
                  disabled={mode === "edit"}
                />
              </div>

              <div>
                <CustomCheckbox
                  checked={form.isActive}
                  onChange={(checked) =>
                    setForm((prev) => ({ ...prev, isActive: checked }))
                  }
                  label="Active"
                />
              </div>

              {mode === "edit" && initialValues?.isInternal && (
                <p className="text-xs text-gray-500">
                  Internal stores is locked for deletion and visibility mode.
                </p>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onCancel}
                  className="rounded-[4px] border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="rounded-[4px] bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-60"
                >
                  {isLoading
                    ? "Saving..."
                    : mode === "create"
                      ? "Create Store"
                      : "Save Changes"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditResellerStoreDialog;
