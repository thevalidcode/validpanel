import { type FC, type FormEvent, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PackageIcon, DollarSign, FileText, Zap, Clock } from "lucide-react";
import type {
  SubscriptionPlan,
  SubscriptionPlanFeatures,
  SubscriptionPlanInterval,
} from "@/types";
import CustomSelect, {
  type CustomSelectRef,
  type Option,
} from "@/components/ui/CustomSelect";
import JsonEditor from "./JsonEditor";
import { currency as currencyMap, getCurrencySymbol } from "@/_docs/doc";
import {
  CurrencyEuroIcon,
  PercentBadgeIcon,
} from "@heroicons/react/24/outline";

export type DialogMode = "create" | "edit";

interface SubscriptionPlanForm {
  name: string;
  price: string;
  currency: string;
  description: string | null;
  features: SubscriptionPlanFeatures;
  interval: SubscriptionPlanInterval;
  discountForAnnually: number | null;
  tax: number | null;
  gracePeriod: number | null;
}

interface EditSubscriptionPlanDialogProps {
  open: boolean;
  mode: DialogMode | null;
  initialValues?: SubscriptionPlan;
  isLoading?: boolean;
  onCancel: () => void;
  onSubmit: (data: SubscriptionPlanForm) => void;
}

const DEFAULT_FEATURES: SubscriptionPlanFeatures = {
  stores: 1,
  products: 50,
  staff_accounts: 1,
  payment_gateways: 1,
  available_templates: 5,
  analytics: false,
  api_access: false,
  ai_features: false,
  priority_support: false,
  custom_branding: false,
  custom_domain: false,
  free_ssl: false,
  hide_platform_banner: false,
  custom_templates: false,
  unlimited_products: false,
  social_store_order_sync: false,
  social_store_service_sync: false,
  store_email_notifications: false,
  store_custom_emails: false,
  store_newsletters: false,
  max_shipping_accounts: 0,
};

const EditSubscriptionPlanDialog: FC<EditSubscriptionPlanDialogProps> = ({
  open,
  mode = "edit",
  initialValues,
  isLoading = false,
  onCancel,
  onSubmit,
}) => {
  const [form, setForm] = useState<SubscriptionPlanForm>({
    name: "",
    price: "",
    currency: "USD",
    description: null,
    features: DEFAULT_FEATURES,
    interval: "MONTHLY",
    discountForAnnually: null,
    tax: null,
    gracePeriod: null,
  });

  const intervalSelectRef = useRef<CustomSelectRef>(null);
  const currencySelectRef = useRef<CustomSelectRef>(null);

  useEffect(() => {
    if (mode === "edit" && initialValues) {
      setForm({
        name: initialValues.name,
        price: initialValues.price,
        currency: initialValues.currency,
        description: initialValues.description,
        features: initialValues.features,
        interval: initialValues.interval,
        discountForAnnually: initialValues.discountForAnnually,
        gracePeriod: initialValues.gracePeriod,
        tax: initialValues.tax,
      });
    } else if (mode === "create") {
      setForm({
        name: "",
        price: "",
        currency: "USD",
        description: null,
        features: DEFAULT_FEATURES,
        interval: "MONTHLY",
        discountForAnnually: null,
        tax: null,
        gracePeriod: null,
      });
    }
  }, [mode, initialValues, open]);

  const currencyOptions: Option<string>[] = Object.keys(currencyMap).map(
    (code) => ({
      label: `${code} (${getCurrencySymbol(code)})`,
      value: code,
    })
  );

  const intervalOptions: Option<SubscriptionPlanInterval>[] = [
    { label: "Monthly", value: "MONTHLY" },
    { label: "Yearly", value: "YEARLY" },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: ["price", "tax", "discountForAnnually"].includes(name)
        ? value === ""
          ? null
          : value
        : value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const intervalValid = intervalSelectRef.current?.validate() ?? true;
    const currencyValid = currencySelectRef.current?.validate() ?? true;

    if (intervalValid && currencyValid) {
      onSubmit(form);
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
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <PackageIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  {mode === "create"
                    ? "Create Subscription Plan"
                    : "Edit Subscription Plan"}
                </h3>
                <p className="text-sm text-gray-500">
                  {mode === "create"
                    ? "Add a new subscription plan with features"
                    : "Update subscription plan details and features"}
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-5">
              {/* Plan Name */}
              <Field
                label="Plan Name"
                icon={<PackageIcon className="w-4 h-4" />}
              >
                <input
                  name="name"
                  title="name"
                  required
                  placeholder="e.g., Professional Plan"
                  value={form.name}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </Field>

              {/* Price & Currency Row */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="Price" icon={<DollarSign className="w-4 h-4" />}>
                  <input
                    name="price"
                    title="price"
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={form.price}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </Field>

                <Field
                  label="Currency"
                  icon={<CurrencyEuroIcon className="w-4 h-4" />}
                >
                  <CustomSelect
                    options={currencyOptions}
                    ref={currencySelectRef}
                    value={currencyOptions.find(
                      (c) => c.value === form.currency
                    )}
                    onChange={(opt) =>
                      setForm((p) => ({
                        ...p,
                        currency: (opt as Option<string>).value,
                      }))
                    }
                  />
                </Field>
              </div>

              {/* Interval & Discount Row */}
              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="Billing Interval"
                  icon={<Zap className="w-4 h-4" />}
                >
                  <CustomSelect
                    options={intervalOptions}
                    ref={intervalSelectRef}
                    value={intervalOptions.find(
                      (i) => i.value === form.interval
                    )}
                    onChange={(opt) =>
                      setForm((p) => ({
                        ...p,
                        interval: (opt as Option<SubscriptionPlanInterval>)
                          .value,
                      }))
                    }
                  />
                </Field>

                <Field
                  label="Annual Discount (%)"
                  icon={<PercentBadgeIcon className="w-4 h-4" />}
                >
                  <input
                    name="discountForAnnually"
                    title="discountForAnnually"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    placeholder="10"
                    value={form.discountForAnnually ?? ""}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </Field>
              </div>

              {/* Grace Period & Tax */}
              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="Grace Period (Days)"
                  icon={<Clock className="w-4 h-4" />}
                >
                  <input
                    name="gracePeriod"
                    title="gracePeriod"
                    type="number"
                    step="1"
                    min="0"
                    placeholder="0"
                    value={form.gracePeriod ?? ""}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </Field>
                {/* Tax */}
                <Field
                  label="Tax (%)"
                  icon={<PercentBadgeIcon className="w-4 h-4" />}
                >
                  <input
                    name="tax"
                    title="tax"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0"
                    value={form.tax ?? ""}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </Field>
              </div>
              {/* Description */}
              <Field
                label="Description"
                icon={<FileText className="w-4 h-4" />}
              >
                <textarea
                  name="description"
                  title="description"
                  placeholder="Plan description..."
                  value={form.description ?? ""}
                  onChange={handleChange}
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition resize-none disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </Field>

              {/* Features JSON Editor */}
              <JsonEditor
                label="Features (JSON)"
                value={form.features}
                onChange={(features) =>
                  setForm((p) => ({
                    ...p,
                    features: features as SubscriptionPlanFeatures,
                  }))
                }
              />
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
                {mode === "edit" && isLoading
                  ? "Saving..."
                  : mode === "create" && isLoading
                  ? "Creating..."
                  : mode === "edit"
                  ? "Save changes"
                  : "Create Plan"}
              </button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditSubscriptionPlanDialog;

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
