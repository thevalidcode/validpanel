import { type FC, type FormEvent, useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PackageIcon, FileText, Clock, Edit2, X, Trash2 } from "lucide-react";
import type {
  SubscriptionPlan,
  SubscriptionPlanFeatures,
  BillingInterval,
} from "@/types";
import JsonEditor from "./JsonEditor";
import PriceEditForm from "./PriceEditForm";
import DeleteDialog from "@/components/DeleteDialog";

export type DialogMode = "create" | "edit";

interface CreatePlanPriceData {
  interval: BillingInterval;
  price: string;
  tax?: number | null;
  amountInMinor: number;
  currency: string;
  externalId?: string | null;
  isActive?: boolean;
  isDefault?: boolean;
}

interface SubscriptionPlanForm {
  name: string;
  description: string | null;
  features: SubscriptionPlanFeatures;
  gracePeriod: number | null;
  prices: CreatePlanPriceData[];
}

interface EditSubscriptionPlanDialogProps {
  open: boolean;
  mode: DialogMode | null;
  initialValues?: SubscriptionPlan; // Contains existing prices if edit
  isLoading?: boolean;
  onCancel: () => void;
  onSubmit: (data: SubscriptionPlanForm) => void;
  // Optional handlers for direct price manipulation in edit mode
  onAddPrice?: (planId: number, data: CreatePlanPriceData) => Promise<any>;
  onUpdatePrice?: (
    planId: number,
    priceId: number,
    data: Partial<CreatePlanPriceData>,
  ) => Promise<any>;
  onDeletePrice?: (planId: number, priceId: number) => Promise<void>;
  // onDeletePrice? // if needed
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
  onAddPrice,
  onUpdatePrice,
  onDeletePrice,
}) => {
  const [form, setForm] = useState<SubscriptionPlanForm>({
    name: "",
    description: null,
    features: DEFAULT_FEATURES,
    gracePeriod: null,
    prices: [],
  });

  const [activeTab, setActiveTab] = useState<"details" | "prices">("details");
  const [editingPriceIndex, setEditingPriceIndex] = useState<number | null>(
    null,
  );
  const [editingPriceId, setEditingPriceId] = useState<number | null>(null); // For Edit mode real prices
  const [deletePriceTarget, setDeletePriceTarget] = useState<{
    idx: number;
    priceId?: number;
  } | null>(null);

  const priceListRef = useRef<HTMLDivElement>(null);

  // Smooth scroll to bottom when new price is added
  useEffect(() => {
    if (activeTab === "prices" && priceListRef.current) {
      priceListRef.current.scrollTo({
        top: priceListRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.prices.length, activeTab]);

  useEffect(() => {
    if (mode === "edit" && initialValues) {
      setForm({
        name: initialValues.name,
        description: initialValues.description,
        features: initialValues.features,
        gracePeriod: initialValues.gracePeriod,
        // In edit mode, we might just display prices from initialValues,
        // but for the form submission (update), we usually just update plan details.
        // Prices are managed separately.
        prices: (initialValues.prices || []) as unknown as CreatePlanPriceData[],
      });
    } else if (mode === "create") {
      setForm({
        name: "",
        description: null,
        features: DEFAULT_FEATURES,
        gracePeriod: null,
        prices: [],
      });
    }
    setActiveTab("details");
  }, [mode, initialValues, open]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: ["gracePeriod"].includes(name)
        ? value === ""
          ? null
          : value
        : value,
    }));
  };

  const handlePriceSubmit = async (priceData: CreatePlanPriceData) => {
    if (mode === "create") {
      // Local state management
      if (editingPriceIndex !== null) {
        setForm((prev) => {
          const newPrices = [...prev.prices];
          newPrices[editingPriceIndex] = priceData;
          return { ...prev, prices: newPrices };
        });
      } else {
        setForm((prev) => ({
          ...prev,
          prices: [...prev.prices, priceData],
        }));
      }
    } else if (mode === "edit" && initialValues) {
      // API calls
      try {
        if (editingPriceId) {
          await onUpdatePrice?.(initialValues.id, editingPriceId, priceData);

          // Update local state for UI immediately
          setForm((prev) => ({
            ...prev,
            prices: prev.prices.map((p: any) =>
              p.id === editingPriceId ? { ...p, ...priceData } : p,
            ),
          }));
        } else {
          const res = await onAddPrice?.(initialValues.id, priceData);

          // If backend returns the new price object (with ID), use it. otherwise use submitted data
          const newPrice =
            res && typeof res === "object"
              ? {
                  ...priceData,
                  ...res,
                  // Ensure price is string if backend returns a Decimal object
                  price:
                    typeof res.price === "object"
                      ? priceData.price
                      : res.price || priceData.price,
                }
              : priceData;

          setForm((prev) => ({
            ...prev,
            prices: [...prev.prices, newPrice],
          }));
        }
      } catch (err) {
        // error handled in hook
      }
    }
    setEditingPriceIndex(null);
    setEditingPriceId(null);
  };

  const handleDeletePrice = (idx: number, priceId?: number) => {
    setDeletePriceTarget({ idx, priceId });
  };

  const handleConfirmDeletePrice = async () => {
    if (!deletePriceTarget) return;
    const { idx, priceId } = deletePriceTarget;

    if (mode === "create") {
      setForm((prev) => {
        const newPrices = [...prev.prices];
        newPrices.splice(idx, 1);
        return { ...prev, prices: newPrices };
      });
      setDeletePriceTarget(null);
    } else if (mode === "edit" && initialValues && priceId) {
      try {
        await onDeletePrice?.(initialValues.id, priceId);
        setForm((prev) => {
          const newPrices = [...prev.prices];
          newPrices.splice(idx, 1);
          return { ...prev, prices: newPrices };
        });
        setDeletePriceTarget(null);
      } catch (err) {
        // error handled in hook
      }
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const existingPrices = form.prices;

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            key="edit-subscription-dialog"
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
              className="w-full max-w-3xl rounded-[4px] bg-white border border-gray-200 shadow-xl max-h-[90vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[4px] bg-primary/10 text-primary flex items-center justify-center">
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
                      ? "Add a new subscription plan & prices"
                      : "Manage plan details and pricing tiers"}
                  </p>
                </div>
              </div>
              <button
                title="close"
                onClick={onCancel}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 px-6 space-x-6">
              <button
                type="button"
                onClick={() => setActiveTab("details")}
                className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "details"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Plan Details
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("prices")}
                className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "prices"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Pricing ({existingPrices.length})
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 bg-gray-50/50">
              {activeTab === "details" ? (
                <div className="space-y-5">
                  <Field
                    label="Plan Name"
                    icon={<PackageIcon className="w-4 h-4" />}
                  >
                    <input
                      name="name"
                      required
                      placeholder="e.g., Professional Plan"
                      value={form.name}
                      onChange={handleChange}
                      className="mt-1 w-full outline-none rounded-[4px] border border-gray-300 px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-60"
                    />
                  </Field>

                  <Field
                    label="Grace Period (Days)"
                    icon={<Clock className="w-4 h-4" />}
                  >
                    <input
                      name="gracePeriod"
                      type="text"
                      placeholder="0"
                      value={form.gracePeriod ?? ""}
                      onChange={handleChange}
                      className="mt-1 w-full outline-none rounded-[4px] border border-gray-300 px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-60"
                    />
                  </Field>

                  <Field
                    label="Description"
                    icon={<FileText className="w-4 h-4" />}
                  >
                    <textarea
                      name="description"
                      placeholder="Plan description..."
                      value={form.description ?? ""}
                      onChange={handleChange}
                      rows={3}
                      className="mt-1 w-full outline-none rounded-[4px] border border-gray-300 px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary resize-none disabled:opacity-60"
                    />
                  </Field>

                  <JsonEditor
                    label="Features (JSON Config)"
                    value={form.features}
                    onChange={(features) =>
                      setForm((p) => ({
                        ...p,
                        features: features as SubscriptionPlanFeatures,
                      }))
                    }
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Price List */}
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar" ref={priceListRef}>
                    {existingPrices.map((price: any, idx: number) => (
                      <div
                        key={price.id || idx}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-[4px] bg-gray-50"
                      >
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900">
                            {price.currency} {String(price.price)} /{" "}
                            {price.interval === "MONTHLY" ? "mo" : "yr"}
                          </span>
                          <span className="text-xs text-gray-500">
                            Tax: {String(price.tax || 0)}% | Active:{" "}
                            {price.isActive ? "Yes" : "No"} | Default:{" "}
                            {price.isDefault ? "Yes" : "No"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            title="edit"
                            type="button"
                            onClick={() => {
                              if (mode === "edit") {
                                setEditingPriceId(price.id);
                              } else {
                                setEditingPriceIndex(idx);
                              }
                              // We need to pass the price data to the form, implemented below via PriceEditForm
                            }}
                            className="p-1 text-gray-500 hover:text-primary"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            title="delete"
                            type="button"
                            onClick={() => handleDeletePrice(idx, price.id)}
                            className="p-1 text-gray-500 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {existingPrices.length === 0 && (
                      <div className="text-center py-8 text-gray-400 text-sm">
                        No prices configured yet.
                      </div>
                    )}
                  </div>

                  <PriceEditForm
                    onSubmit={handlePriceSubmit}
                    initialData={
                      (mode === "create" && editingPriceIndex !== null
                        ? form.prices[editingPriceIndex]
                        : mode === "edit" && editingPriceId
                          ? initialValues?.prices.find(
                              (p) => p.id === editingPriceId,
                            )
                          : undefined) as CreatePlanPriceData | undefined
                    }
                    onCancel={() => {
                      setEditingPriceIndex(null);
                      setEditingPriceId(null);
                    }}
                    mode={
                      editingPriceIndex !== null || editingPriceId !== null
                        ? "edit"
                        : "create"
                    }
                  />
                </div>
              )}
            </div>

            {/* Footer - Only show on Details tab or if we want global save */}
            {activeTab === "details" && (
              <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-white">
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
                  {isLoading ? "Saving..." : "Save Plan"}
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

    <DeleteDialog
        open={!!deletePriceTarget}
        title="Delete Price"
        description="Are you sure you want to delete this price permanently?"
        onCancel={() => setDeletePriceTarget(null)}
        onConfirm={handleConfirmDeletePrice}
        isLoading={isLoading}
      />
    </>
  );
};

export default EditSubscriptionPlanDialog;

export function Field({
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
