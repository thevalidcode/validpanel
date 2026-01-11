import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CreditCard,
  KeyRound,
  Landmark,
  Pencil,
  Upload,
  X,
  Shield,
  Copy,
  CheckCheck,
} from "lucide-react";
import ImageUploadBox from "@/components/ImageUploadBox";
import CustomSelect, {
  type CustomSelectRef,
  type Option,
} from "@/components/ui/CustomSelect";
import type { PaymentGatewayStatus, PaymentMethod } from "@/types";

interface EditPGDialogProps {
  open: boolean;
  mode: "create" | "edit";
  initialValues?: {
    uid?: string;
    platform: PaymentMethod;
    name: string;
    image: string;
    min: string;
    max: string;
    secretKey?: string;
    description?: string;
    content?: string;
    status?: PaymentGatewayStatus;
  };
  isLoading?: boolean;
  signature?: string;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  onSignatureClose?: () => void;
}

type FormState = {
  platform: PaymentMethod | "";
  name: string;
  image: string;
  min: string;
  max: string;
  secretKey: string;
  description: string;
  content: string;
  status: PaymentGatewayStatus | "";
};

const PAYMENT_METHODS: Option<PaymentMethod>[] = [
  { label: "Flutterwave", value: "FLUTTERWAVE" },
  { label: "Paystack", value: "PAYSTACK" },
  { label: "Manual", value: "MANUAL" },
];

const STATUS_OPTIONS: Option<PaymentGatewayStatus>[] = [
  { label: "Active", value: "ACTIVE" },
  { label: "Disabled", value: "DISABLED" },
];

export default function EditPGDialog({
  open,
  mode,
  initialValues,
  isLoading = false,
  signature,
  onSubmit,
  onCancel,
  onSignatureClose,
}: EditPGDialogProps) {
  const platformSelectRef = useRef<CustomSelectRef>(null);
  const statusSelectRef = useRef<CustomSelectRef>(null);
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState<FormState>({
    platform: initialValues?.platform ?? "",
    name: initialValues?.name ?? "",
    image: initialValues?.image ?? "",
    min: initialValues?.min ?? "",
    max: initialValues?.max ?? "",
    secretKey: initialValues?.secretKey ?? "",
    description: initialValues?.description ?? "",
    content: initialValues?.content ?? "",
    status: initialValues?.status ?? "ACTIVE",
  });

  useEffect(() => {
    if (!open) return;
    setForm({
      platform: initialValues?.platform ?? "",
      name: initialValues?.name ?? "",
      image: initialValues?.image ?? "",
      min: initialValues?.min ?? "",
      max: initialValues?.max ?? "",
      secretKey: initialValues?.secretKey ?? "",
      description: initialValues?.description ?? "",
      content: initialValues?.content ?? "",
      status: initialValues?.status ?? "ACTIVE",
    });
  }, [open, initialValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const platformValid = platformSelectRef.current?.validate() ?? true;
    const statusValid =
      mode === "edit" ? statusSelectRef.current?.validate() ?? true : true;
    if (!platformValid) return;
    if (!statusValid) return;

    const payload = {
      ...(mode === "edit" && { uid: initialValues?.uid }),
      platform: form.platform,
      name: form.name.trim(),
      image: form.image,
      min: form.min.trim(),
      max: form.max.trim(),
      secretKey: form.platform === "MANUAL" ? undefined : form.secretKey.trim(),
      description: form.description.trim(),
      content: form.content.trim(),
      status: mode === "edit" ? form.status : undefined,
    };

    onSubmit(payload);
  };

  const handleCopySignature = async () => {
    if (!signature) return;
    try {
      await navigator.clipboard.writeText(signature);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy signature:", err);
    }
  };

  const isManual = form.platform === "MANUAL";

  return (
    <>
      {/* Signature Popup Dialog */}
      <AnimatePresence>
        {signature && (
          <motion.div
            className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onSignatureClose}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full max-w-lg rounded-2xl bg-white border border-gray-200 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200 bg-white rounded-t-2xl">
                <div className="w-11 h-11 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {mode === "create" ? "Gateway Created" : "Gateway Updated"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Your gateway has been{" "}
                    {mode === "create" ? "created" : "updated"} successfully.
                    This signature will only be shown once, copy and store it
                    safely.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onSignatureClose}
                  className="text-gray-400 hover:text-gray-600 transition"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-5 space-y-4">
                <div className="space-y-1">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <span className="text-gray-400">
                      <Shield className="w-4 h-4" />
                    </span>
                    Signature
                  </label>
                  <div className="relative">
                    <input
                      title="signature"
                      type="text"
                      value={signature}
                      readOnly
                      className="w-full rounded-lg border border-gray-200 px-3 py-2.5 pr-10 text-sm text-gray-900 bg-gray-50 font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
                    />
                    <button
                      type="button"
                      onClick={handleCopySignature}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                      title="Copy signature"
                    >
                      {copied ? (
                        <CheckCheck className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-amber-600 mt-1">
                    ⚠️ This signature will not be shown again. Please copy and
                    store it securely.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-white rounded-b-2xl">
                <button
                  type="button"
                  onClick={onSignatureClose}
                  className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-primary/90"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Edit Dialog */}
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
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full max-w-2xl rounded-2xl bg-white border border-gray-200 shadow-xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 z-10 flex items-center gap-3 px-6 py-4 border-b border-gray-200 bg-white">
                <div className="w-11 h-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {mode === "create"
                      ? "Create Payment Gateway"
                      : "Edit Payment Gateway"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Configure platform, limits, and credentials for this
                    gateway.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onCancel}
                  className="ml-auto text-gray-400 hover:text-gray-600 transition"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-5 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field
                    label="Payment Platform"
                    icon={<Landmark className="w-4 h-4" />}
                  >
                    <CustomSelect
                      ref={platformSelectRef}
                      options={PAYMENT_METHODS}
                      value={PAYMENT_METHODS.find(
                        (m) => m.value === form.platform
                      )}
                      placeholder="Select platform"
                      required
                      onChange={(opt) => {
                        if (Array.isArray(opt)) return;
                        setForm((prev) => ({ ...prev, platform: opt.value }));
                      }}
                    />
                  </Field>

                  <Field
                    label="Gateway Name"
                    icon={<CreditCard className="w-4 h-4" />}
                  >
                    <input
                      required
                      value={form.name}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, name: e.target.value }))
                      }
                      placeholder="e.g., Stripe Production"
                      className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field
                    label="Min Amount"
                    icon={<Upload className="w-4 h-4" />}
                  >
                    <input
                      required
                      value={form.min}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, min: e.target.value }))
                      }
                      placeholder="100"
                      className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
                    />
                  </Field>

                  <Field
                    label="Max Amount"
                    icon={<Upload className="w-4 h-4" />}
                  >
                    <input
                      required
                      value={form.max}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, max: e.target.value }))
                      }
                      placeholder="100000"
                      className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
                    />
                  </Field>
                </div>

                {!isManual && (
                  <Field
                    label="Secret Key"
                    icon={<KeyRound className="w-4 h-4" />}
                  >
                    <input
                      required={!isManual}
                      type="password"
                      value={form.secretKey}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, secretKey: e.target.value }))
                      }
                      placeholder="sk_live_..."
                      className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition font-mono"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Stored encrypted and hidden in logs.
                    </p>
                  </Field>
                )}

                <Field
                  label="Description"
                  icon={<Pencil className="w-4 h-4" />}
                >
                  <input
                    value={form.description}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, description: e.target.value }))
                    }
                    placeholder="Short label for this gateway"
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
                  />
                </Field>

                {mode === "edit" && (
                  <Field
                    label="Status"
                    icon={<CreditCard className="w-4 h-4" />}
                  >
                    <CustomSelect
                      ref={statusSelectRef}
                      options={STATUS_OPTIONS}
                      value={STATUS_OPTIONS.find(
                        (s) => s.value === form.status
                      )}
                      required
                      onChange={(opt) => {
                        if (Array.isArray(opt)) return;
                        setForm((p) => ({ ...p, status: opt.value }));
                      }}
                    />
                  </Field>
                )}

                <Field label="Content" icon={<Pencil className="w-4 h-4" />}>
                  <textarea
                    value={form.content}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, content: e.target.value }))
                    }
                    placeholder="Detailed instructions or notes for this gateway"
                    rows={4}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition resize-none"
                  />
                </Field>

                <div className="border border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                  <ImageUploadBox
                    label=" Gateway Logo"
                    collection="payment-gateways"
                    onUploaded={(url) => setForm((p) => ({ ...p, image: url }))}
                  />
                </div>

                <Field
                  label="Webhook Url"
                  icon={<CreditCard className="w-4 h-4" />}
                >
                  <input
                    disabled
                    title="webhook"
                    value={`api.${
                      window.location.origin
                    }/v1/webhooks/${form.platform.toLowerCase()}`}
                    className="mt-1 w-full disabled:bg-gray-200 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
                  />
                </Field>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-white">
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
                  {isLoading
                    ? mode === "create"
                      ? "Creating..."
                      : "Saving..."
                    : mode === "create"
                    ? "Create Gateway"
                    : "Save Changes"}
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <span className="text-gray-400">{icon}</span>
        {label}
      </label>
      {children}
    </div>
  );
}
