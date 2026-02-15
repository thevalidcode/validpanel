import { type FC, type FormEvent, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { User, Mail, Lock, TrendingUp } from "lucide-react";
import CustomSelect, {
  type CustomSelectRef,
  type Option,
} from "@/components/ui/CustomSelect";
import { REFERRAL_SOURCES } from "@/constants/referralSources";

export type DialogMode = "create";

interface UserForm {
  email: string;
  fullName: string;
  password: string;
  referralSource: string;
  additionalInfo?: string;
}

interface CreateUserDialogProps {
  open: boolean;
  isLoading?: boolean;
  onCancel: () => void;
  onSubmit: (data: UserForm) => void;
}

const referralSourceOptions: Option<string>[] = REFERRAL_SOURCES.map(
  (source) => ({
    label: source,
    value: source,
  })
);

const CreateUserDialog: FC<CreateUserDialogProps> = ({
  open,
  isLoading = false,
  onCancel,
  onSubmit,
}) => {
  const [form, setForm] = useState<UserForm>({
    email: "",
    fullName: "",
    password: "",
    referralSource: "",
    additionalInfo: "",
  });

  const referralSelectRef = useRef<CustomSelectRef>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const referralValid = referralSelectRef.current?.validate() ?? true;

    if (referralValid && form.referralSource) {
      onSubmit(form);
      // Reset form after submission
      setForm({
        email: "",
        fullName: "",
        password: "",
        referralSource: "",
        additionalInfo: "",
      });
    }
  };

  const handleCancel = () => {
    // Reset form on cancel
    setForm({
      email: "",
      fullName: "",
      password: "",
      referralSource: "",
      additionalInfo: "",
    });
    onCancel();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4"
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
            className="w-full max-w-xl rounded-2xl bg-white shadow-xl"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Create User</h3>
                <p className="text-sm text-gray-500">
                  Add a new user to the platform
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-5">
              <Field label="Full name*" icon={<User className="w-4 h-4" />}>
                <input
                  name="fullName"
                  title="fullName"
                  required
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </Field>

              <Field label="Email address*" icon={<Mail className="w-4 h-4" />}>
                <input
                  name="email"
                  title="email"
                  type="email"
                  value={form.email}
                  required
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </Field>

              <Field label="Password*" icon={<Lock className="w-4 h-4" />}>
                <input
                  title="password"
                  type="password"
                  name="password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </Field>

              <Field
                label="Referral Source*"
                icon={<TrendingUp className="w-4 h-4" />}
              >
                <CustomSelect
                  options={referralSourceOptions}
                  ref={referralSelectRef}
                  value={
                    referralSourceOptions.find(
                      (r) => r.value === form.referralSource
                    ) || undefined
                  }
                  required={true}
                  isSearchable={true}
                  placeholder="Select how they heard about us..."
                  onChange={(opt) =>
                    setForm((p) => ({
                      ...p,
                      referralSource: (opt as Option<string>).value,
                    }))
                  }
                />
                <p className="text-xs text-gray-500 mt-1.5">
                  Track where this user came from for marketing analytics
                </p>
              </Field>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Additional Marketing Details (Optional)
                </label>
                <textarea
                  name="additionalInfo"
                  value={form.additionalInfo}
                  onChange={handleChange}
                  placeholder="E.g., campaign name, referrer details, etc."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition resize-none"
                  rows={3}
                  maxLength={500}
                />
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-gray-500">
                    Help track specific campaigns or referrers
                  </p>
                  <span className="text-xs text-gray-400">
                    {form.additionalInfo?.length || 0}/500
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
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
                {isLoading ? "Creating..." : "Create User"}
              </button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateUserDialog;

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
