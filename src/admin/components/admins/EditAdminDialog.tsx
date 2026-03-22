import { type FC, type FormEvent, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { User, Mail, Lock, Shield, ImageIcon } from "lucide-react";
import type { Admin, AdminStatus, Role } from "@/types";
import CustomSelect, {
  type CustomSelectRef,
  type Option,
} from "@/components/ui/CustomSelect";
import ImageUploadBox from "@/components/ImageUploadBox";

export type DialogMode = "create" | "edit";

interface AdminForm {
  email: string;
  fullName: string;
  roleId: number;
  password?: string;
  image?: string;
  status?: AdminStatus;
}

interface EditAdminDialogProps {
  open: boolean;
  mode: DialogMode | null;
  roles: Role[];
  initialValues?: Admin;
  isLoading?: boolean;
  onCancel: () => void;
  onSubmit: (data: AdminForm) => void;
}

const EditAdminDialog: FC<EditAdminDialogProps> = ({
  open,
  mode = "edit",
  roles,
  initialValues,
  isLoading = false,
  onCancel,
  onSubmit,
}) => {
  const [form, setForm] = useState<AdminForm>({
    email: "",
    fullName: "",
    roleId: 0,
    password: "",
    image: "",
    status: "ACTIVE",
  });
  const roleSelectRef = useRef<CustomSelectRef>(null);
  const statusSelectRef = useRef<CustomSelectRef>(null);

  useEffect(() => {
    if (mode === "edit" && initialValues) {
      setForm({
        email: initialValues.email,
        fullName: initialValues.fullName,
        roleId: initialValues.roleId,
        image: initialValues.image ?? "",
        status: initialValues.status,
      });
    }
  }, [mode, initialValues]);

  const roleOptions: Option<number>[] = roles.map((r) => ({
    label: r.name,
    value: r.id,
  }));

  const statusOptions: Option<AdminStatus>[] = [
    { label: "Active", value: "ACTIVE" },
    { label: "Banned", value: "BANNED" },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const roleValid = roleSelectRef.current?.validate() ?? true;
    const statusValid = statusSelectRef.current?.validate() ?? true;

    if (roleValid && statusValid) {
      const payload: AdminForm =
        mode === "create"
          ? {
              email: form.email,
              fullName: form.fullName,
              roleId: form.roleId,
              password: form.password!,
            }
          : {
              email: form.email,
              fullName: form.fullName,
              roleId: form.roleId,
              image: form.image,
              status: form.status,
            };

      onSubmit(payload);
    }
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
          <motion.form
            onSubmit={handleSubmit}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full max-w-xl rounded-[4px] bg-white border border-gray-200 shadow-xl"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200">
              <div className="w-10 h-10 rounded-[4px] bg-primary/10 text-primary flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  {mode === "create" ? "Create Admin" : "Edit Admin"}
                </h3>
                <p className="text-sm text-gray-500">
                  {mode === "create"
                    ? "Add a new administrator"
                    : "Update admin details and access"}
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-5">
              <Field label="Full name" icon={<User className="w-4 h-4" />}>
                <input
                  name="fullName"
                  title="fullName"
                  required
                  value={form.fullName}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-[4px] border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </Field>

              <Field label="Email address" icon={<Mail className="w-4 h-4" />}>
                <input
                  name="email"
                  title="email"
                  type="email"
                  value={form.email}
                  required
                  onChange={handleChange}
                  className="mt-1 w-full rounded-[4px] border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </Field>

              {mode === "create" && (
                <Field label="Password" icon={<Lock className="w-4 h-4" />}>
                  <input
                    title="password"
                    type="password"
                    name="password"
                    required
                    value={form.password}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-[4px] border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </Field>
              )}

              <Field label="Role" icon={<Shield className="w-4 h-4" />}>
                <CustomSelect
                  options={roleOptions}
                  ref={roleSelectRef}
                  value={roleOptions.find((r) => r.value === form.roleId)}
                  required={true}
                  onChange={(opt) =>
                    setForm((p) => ({
                      ...p,
                      roleId: (opt as Option<number>).value,
                    }))
                  }
                />
              </Field>

              {mode === "edit" && (
                <>
                  <ImageUploadBox
                    collection="admins"
                    variant="box"
                    label="Profile image"
                    labelIcon={<ImageIcon className="w-4 h-4" />}
                    onUploaded={(url) => setForm((p) => ({ ...p, image: url }))}
                  />

                  <Field label="Status" icon={<Shield className="w-4 h-4" />}>
                    <CustomSelect
                      ref={statusSelectRef}
                      options={statusOptions}
                      value={statusOptions.find((s) => s.value === form.status)}
                      onChange={(opt) =>
                        setForm((p) => ({
                          ...p,
                          status: (opt as Option<AdminStatus>).value,
                        }))
                      }
                    />
                  </Field>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onCancel}
                disabled={isLoading}
                className="rounded-[4px] border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="rounded-[4px] bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-60"
              >
                {mode === "edit" && isLoading
                  ? "Saving..."
                  : mode === "create" && isLoading
                  ? "Creating..."
                  : mode === "edit"
                  ? "Save changes"
                  : "Create Admin"}
              </button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditAdminDialog;

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
