import { type FC, type FormEvent, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Copy,
  Percent,
  Calendar,
  FileDigit,
  ShieldCheck,
  PercentIcon,
  X,
  CreditCard,
  Layers,
  Globe,
  DollarSign,
  Mail,
  User,
  Plus,
  Trash2,
  Edit2,
  MapPin,
} from "lucide-react";
import type {
  Coupon,
  DiscountType,
  BillingInterval,
  CouponAppliesTo,
} from "../../../types/models/coupon";
import CustomSelect, { type Option } from "@/components/ui/CustomSelect";
import CustomCheckbox from "@/components/ui/CustomCheckbox";
import { useGetAdminSubscriptionPlans } from "@/hooks/use-subscription-plan";
import { currency as currencyList } from "@/_docs/doc";

export type DialogMode = "create" | "edit" | "duplicate";

const COUPON_CONTEXT_OPTIONS = [
  "HOME_PAGE",
  "PRICING_PAGE",
  "STORES_PAGE",
  "ANALYTICS_PAGE",
  "SUBSCRIPTION_PAGE",
];

const COUPON_APPLIES_TO_OPTIONS: CouponAppliesTo[] = [
  "NEW",
  "RENEWAL",
  "UPGRADE",
];

export interface CouponRuleData {
  planId?: number | null;
  interval?: BillingInterval | null;
  currency?: string | null;
  region?: string | null;
}

export interface CouponForm {
  code: string;
  couponOwnerEmail?: string;
  type: DiscountType;
  value: string;
  startsAt?: string; // ISO string
  expiresAt?: string; // ISO string
  maxUses?: number;
  isActive: boolean;
  currency?: string;
  minAmount?: string;
  perUserLimit?: number;
  firstTimeOnly: boolean;
  contexts: string[];
  isPublic: boolean;
  priority: number;
  autoApply: boolean;
  highlightText?: string;
  appliesTo: CouponAppliesTo[];
  rules: CouponRuleData[];
}

export interface CouponSubmitData extends Omit<
  CouponForm,
  "minAmount" | "startsAt" | "expiresAt" | "highlightText"
> {
  minAmount?: number;
  startsAt?: string;
  expiresAt?: string;
  highlightText?: string;
}

interface EditCouponDialogProps {
  open: boolean;
  mode: DialogMode;
  initialValues?: Coupon;
  isLoading?: boolean;
  onCancel: () => void;
  onSubmit: (data: CouponSubmitData) => void;
}

const EditCouponDialog: FC<EditCouponDialogProps> = ({
  open,
  mode,
  initialValues,
  isLoading = false,
  onCancel,
  onSubmit,
}) => {
  const { data: plans } = useGetAdminSubscriptionPlans();
  const [activeTab, setActiveTab] = useState<"details" | "rules">("details");

  // Main form state
  const [form, setForm] = useState<CouponForm>({
    code: "",
    couponOwnerEmail: "",
    type: "FIXED",
    value: "0",
    isActive: true,
    firstTimeOnly: false,
    currency: "USD",
    contexts: [],
    isPublic: false,
    priority: 0,
    autoApply: false,
    highlightText: "",
    appliesTo: ["NEW"],
    rules: [],
  });

  // Rule editing state
  const [editingRuleIndex, setEditingRuleIndex] = useState<number | null>(null);
  const [ruleForm, setRuleForm] = useState<CouponRuleData>({});
  const [isEditingRule, setIsEditingRule] = useState(false);

  useEffect(() => {
    if (open) {
      setActiveTab("details");
      setIsEditingRule(false);
      setEditingRuleIndex(null);
      setRuleForm({});

      if ((mode === "edit" || mode === "duplicate") && initialValues) {
        // Safe access to rules
        const rules = ((initialValues as any).rules || []) as CouponRuleData[];

        setForm({
          code:
            mode === "duplicate"
              ? `${initialValues.code}_COPY`
              : initialValues.code,
          couponOwnerEmail: initialValues.couponOwnerEmail || "",
          type: initialValues.type,
          value: initialValues.value,
          startsAt: initialValues.startsAt
            ? new Date(initialValues.startsAt).toISOString().slice(0, 16)
            : undefined,
          expiresAt: initialValues.expiresAt
            ? new Date(initialValues.expiresAt).toISOString().slice(0, 16)
            : undefined,
          maxUses: initialValues.maxUses ?? undefined,
          isActive: initialValues.isActive,
          currency: initialValues.currency || "USD",
          minAmount: initialValues.minAmount
            ? (initialValues.minAmount / 100).toFixed(2)
            : undefined,
          perUserLimit: initialValues.perUserLimit ?? undefined,
          firstTimeOnly: initialValues.firstTimeOnly,
          contexts: initialValues.contexts || [],
          isPublic: initialValues.isPublic,
          priority: initialValues.priority,
          autoApply: initialValues.autoApply,
          highlightText: initialValues.highlightText || "",
          appliesTo: initialValues.appliesTo || ["NEW"],
          rules: rules,
        });
      } else {
        setForm({
          code: "",
          couponOwnerEmail: "",
          type: "FIXED",
          value: "0",
          isActive: true,
          firstTimeOnly: false,
          currency: "USD",
          contexts: [],
          isPublic: false,
          priority: 0,
          autoApply: false,
          highlightText: "",
          appliesTo: ["NEW"],
          rules: [],
        });
      }
    }
  }, [mode, initialValues, open]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    if (name === "maxUses" || name === "perUserLimit" || name === "priority") {
      setForm((prev) => ({
        ...prev,
        [name]: value === "" ? undefined : Number(value),
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRuleSubmit = () => {
    const newRule = { ...ruleForm };
    // Cleanup undefined/null values if needed or keep strictly as is
    if (editingRuleIndex !== null) {
      // Update existing
      setForm((prev) => {
        const updatedRules = [...prev.rules];
        updatedRules[editingRuleIndex] = newRule;
        return { ...prev, rules: updatedRules };
      });
    } else {
      // Add new
      setForm((prev) => ({
        ...prev,
        rules: [...prev.rules, newRule],
      }));
    }
    // Reset rule editing
    setIsEditingRule(false);
    setEditingRuleIndex(null);
    setRuleForm({});
  };

  const handleEditRule = (index: number) => {
    setRuleForm({ ...form.rules[index] });
    setEditingRuleIndex(index);
    setIsEditingRule(true);
  };

  const handleDeleteRule = (index: number) => {
    setForm((prev) => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...form,
      couponOwnerEmail: form.couponOwnerEmail?.trim() || undefined,
      value: form.value,
      startsAt: form.startsAt
        ? new Date(form.startsAt).toISOString()
        : undefined,
      expiresAt: form.expiresAt
        ? new Date(form.expiresAt).toISOString()
        : undefined,
      minAmount: form.minAmount
        ? Math.round(parseFloat(form.minAmount) * 100)
        : undefined,
      contexts: form.contexts,
      appliesTo: form.appliesTo,
      priority: form.priority || 0,
      highlightText: form.highlightText?.trim() || undefined,
    };

    onSubmit(submitData);
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
            className="w-full max-w-2xl rounded-[4px] bg-white border border-gray-200 shadow-xl max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[4px] bg-primary/10 text-primary flex items-center justify-center">
                  <PercentIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    {mode === "create"
                      ? "Create New Coupon"
                      : mode === "duplicate"
                        ? "Duplicate Coupon"
                        : "Edit Coupon"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {mode === "create"
                      ? "Add a new discount coupon"
                      : mode === "duplicate"
                        ? "Review and save duplicated coupon"
                        : "Update coupon details"}
                  </p>
                </div>
              </div>
              <button
                title="Close"
                onClick={onCancel}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 px-6 space-x-6 bg-white">
              <button
                type="button"
                onClick={() => setActiveTab("details")}
                className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "details"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Details
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("rules")}
                className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "rules"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Rules ({form.rules.length})
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 bg-gray-50/50">
              <form id="coupon-form" onSubmit={handleSubmit}>
                {activeTab === "details" ? (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <Field
                        label="Coupon Code"
                        icon={<Copy className="w-4 h-4" />}
                      >
                        <input
                          type="text"
                          name="code"
                          title="Coupon Code"
                          required
                          value={form.code}
                          onChange={handleChange}
                          placeholder="e.g. SUMMER2024"
                          className="mt-1 w-full outline-none rounded-[4px] border border-gray-300 px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-60"
                        />
                      </Field>

                      <Field
                        label="Coupon Owner Email"
                        icon={<Mail className="w-4 h-4" />}
                      >
                        <input
                          type="email"
                          name="couponOwnerEmail"
                          title="Coupon Owner Email"
                          value={form.couponOwnerEmail ?? ""}
                          onChange={handleChange}
                          placeholder="owner@example.com (optional)"
                          className="mt-1 w-full outline-none rounded-[4px] border border-gray-300 px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-60"
                        />
                      </Field>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <Field
                        label="Currency"
                        icon={<DollarSign className="w-4 h-4" />}
                      >
                        <CustomSelect
                          options={Object.keys(currencyList).map((c) => ({
                            label: c,
                            value: c,
                          }))}
                          value={
                            form.currency
                              ? { label: form.currency, value: form.currency }
                              : undefined
                          }
                          onChange={(val) => {
                            const selected = val as Option<string>;
                            setForm((prev) => ({
                              ...prev,
                              currency: selected.value,
                            }));
                          }}
                          isSearchable
                          required={form.type === "FIXED"}
                          placeholder="Select Currency"
                        />
                      </Field>

                      <Field
                        label="Total Max Uses"
                        icon={<FileDigit className="w-4 h-4" />}
                      >
                        <input
                          type="text"
                          name="maxUses"
                          title="Max Uses"
                          min="0"
                          placeholder="Unlimited"
                          value={form.maxUses ?? ""}
                          onChange={handleChange}
                          className="mt-1 w-full outline-none rounded-[4px] border border-gray-300 px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-60"
                        />
                      </Field>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <Field
                        label="Discount Type"
                        icon={<ShieldCheck className="w-4 h-4" />}
                      >
                        <CustomSelect
                          options={[
                            { label: "Fixed Amount", value: "FIXED" },
                            { label: "Percentage (%)", value: "PERCENTAGE" },
                          ]}
                          value={{
                            label:
                              form.type === "FIXED"
                                ? "Fixed Amount"
                                : "Percentage (%)",
                            value: form.type,
                          }}
                          onChange={(val) => {
                            const selected = val as Option<DiscountType>;
                            setForm((prev) => ({
                              ...prev,
                              type: selected.value,
                            }));
                          }}
                        />
                      </Field>

                      <Field
                        label="Discount Value"
                        icon={<Percent className="w-4 h-4" />}
                      >
                        <input
                          type="text"
                          name="value"
                          title="Discount Value"
                          required
                          value={form.value ?? ""}
                          onChange={handleChange}
                          className="mt-1 w-full outline-none rounded-[4px] border border-gray-300 px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-60"
                        />
                      </Field>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Field
                        label="Min. Amount"
                        icon={<CreditCard className="w-4 h-4" />}
                      >
                        <input
                          type="text"
                          name="minAmount"
                          title="Min Order Amount"
                          placeholder="0.00"
                          value={form.minAmount ?? ""}
                          onChange={handleChange}
                          className="mt-1 w-full outline-none rounded-[4px] border border-gray-300 px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-60"
                        />
                      </Field>
                      <Field
                        label="Per User Limit"
                        icon={<User className="w-4 h-4" />}
                      >
                        <input
                          type="text"
                          name="perUserLimit"
                          title="Limit per user"
                          min="1"
                          placeholder="Unlimited"
                          value={form.perUserLimit ?? ""}
                          onChange={handleChange}
                          className="mt-1 w-full outline-none rounded-[4px] border border-gray-300 px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-60"
                        />
                      </Field>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Field
                        label="Valid From"
                        icon={<Calendar className="w-4 h-4" />}
                      >
                        <input
                          type="datetime-local"
                          name="startsAt"
                          title="Valid From"
                          value={form.startsAt || ""}
                          onChange={handleChange}
                          className="mt-1 w-full outline-none rounded-[4px] border border-gray-300 px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-60"
                        />
                      </Field>

                      <Field
                        label="Valid Until"
                        icon={<Calendar className="w-4 h-4" />}
                      >
                        <input
                          type="datetime-local"
                          name="expiresAt"
                          title="Valid Until"
                          value={form.expiresAt || ""}
                          onChange={handleChange}
                          className="mt-1 w-full outline-none rounded-[4px] border border-gray-300 px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-60"
                        />
                      </Field>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Field
                        label="Priority"
                        icon={<Layers className="w-4 h-4" />}
                      >
                        <input
                          type="text"
                          name="priority"
                          title="Coupon Priority"
                          min="0"
                          value={form.priority ?? 0}
                          onChange={handleChange}
                          className="mt-1 w-full outline-none rounded-[4px] border border-gray-300 px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-60"
                        />
                      </Field>

                      <Field
                        label="Highlight Text"
                        icon={<Copy className="w-4 h-4" />}
                      >
                        <input
                          type="text"
                          name="highlightText"
                          title="Highlight Text"
                          placeholder="e.g. Save 25% this week"
                          value={form.highlightText || ""}
                          onChange={handleChange}
                          className="mt-1 w-full outline-none rounded-[4px] border border-gray-300 px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-60"
                        />
                      </Field>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Field
                        label="Visible Contexts"
                        icon={<MapPin className="w-4 h-4" />}
                      >
                        <div className="mt-1 rounded-[4px] border border-gray-300 bg-white p-3 gap-2 flex flex-col">
                          {COUPON_CONTEXT_OPTIONS.map((context) => (
                            <CustomCheckbox
                              key={context}
                              label={context}
                              required={false}
                              name={`context-${context}`}
                              checked={form.contexts.includes(context)}
                              onChange={(checked) =>
                                setForm((prev) => ({
                                  ...prev,
                                  contexts: checked
                                    ? [...new Set([...prev.contexts, context])]
                                    : prev.contexts.filter(
                                        (c) => c !== context,
                                      ),
                                }))
                              }
                            />
                          ))}
                        </div>
                      </Field>

                      <Field
                        label="Applies To"
                        icon={<ShieldCheck className="w-4 h-4" />}
                      >
                        <div className="mt-1 rounded-[4px] border border-gray-300 bg-white p-3 flex flex-col gap-2">
                          {COUPON_APPLIES_TO_OPTIONS.map((target) => (
                            <CustomCheckbox
                              key={target}
                              required={false}
                              label={target}
                              name={`applies-${target}`}
                              checked={form.appliesTo.includes(target)}
                              onChange={(checked) =>
                                setForm((prev) => ({
                                  ...prev,
                                  appliesTo: checked
                                    ? [...new Set([...prev.appliesTo, target])]
                                    : prev.appliesTo.filter(
                                        (c) => c !== target,
                                      ),
                                }))
                              }
                            />
                          ))}
                        </div>
                      </Field>
                    </div>

                    <div className="pt-2 flex flex-wrap gap-6 mt-2">
                      <CustomCheckbox
                        label="Is Active"
                        name="isActive"
                        required={false}
                        checked={form.isActive}
                        onChange={(checked) =>
                          setForm((prev) => ({ ...prev, isActive: checked }))
                        }
                      />
                      <CustomCheckbox
                        label="First Time Users Only"
                        name="firstTimeOnly"
                        required={false}
                        checked={form.firstTimeOnly}
                        onChange={(checked) =>
                          setForm((prev) => ({
                            ...prev,
                            firstTimeOnly: checked,
                          }))
                        }
                      />
                      <CustomCheckbox
                        label="Public Coupon"
                        name="isPublic"
                        required={false}
                        checked={form.isPublic}
                        onChange={(checked) =>
                          setForm((prev) => ({ ...prev, isPublic: checked }))
                        }
                      />
                      <CustomCheckbox
                        label="Auto Apply"
                        name="autoApply"
                        required={false}
                        checked={form.autoApply}
                        onChange={(checked) =>
                          setForm((prev) => ({ ...prev, autoApply: checked }))
                        }
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* List of existing rules */}
                    {form.rules.length > 0 && !isEditingRule && (
                      <div className="space-y-3">
                        {form.rules.map((rule, idx) => (
                          <div
                            key={idx}
                            className="bg-white border border-gray-200 rounded-[4px] p-4 flex items-center justify-between shadow-sm"
                          >
                            <div className="space-y-1">
                              <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                {rule.planId ? (
                                  <span className="flex items-center gap-1.5">
                                    <Layers className="w-3.5 h-3.5 text-primary" />
                                    {plans?.find((p) => p.id === rule.planId)
                                      ?.name || `Plan #${rule.planId}`}
                                  </span>
                                ) : (
                                  <span className="text-gray-500">
                                    All Plans
                                  </span>
                                )}
                                <span className="text-gray-300">•</span>
                                <span>
                                  {rule.interval
                                    ? rule.interval === "MONTHLY"
                                      ? "Monthly"
                                      : "Yearly"
                                    : "Any Cycle"}
                                </span>
                              </div>
                              <div className="text-xs text-gray-500 flex items-center gap-3">
                                {rule.region && (
                                  <span className="flex items-center gap-1">
                                    <Globe className="w-3 h-3" /> {rule.region}
                                  </span>
                                )}
                                {rule.currency && (
                                  <span className="flex items-center gap-1">
                                    <DollarSign className="w-3 h-3" />{" "}
                                    {rule.currency}
                                  </span>
                                )}
                                {!rule.region && !rule.currency && (
                                  <span>No regional format restrictions</span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                title="edit"
                                type="button"
                                onClick={() => handleEditRule(idx)}
                                className="p-1.5 text-gray-500 hover:text-primary hover:bg-primary/5 rounded-[4px] transition"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                title="delete"
                                type="button"
                                onClick={() => handleDeleteRule(idx)}
                                className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-[4px] transition"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Empty state for rules */}
                    {form.rules.length === 0 && !isEditingRule && (
                      <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-[4px] bg-gray-50">
                        <Layers className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                        <h4 className="text-sm font-medium text-gray-900">
                          No Rules Defined
                        </h4>
                        <p className="text-xs text-gray-500 mt-1 mb-4 max-w-xs mx-auto">
                          Create rules to restrict this coupon to specific
                          plans, billing cycles, or regions.
                        </p>
                        <button
                          type="button"
                          onClick={() => setIsEditingRule(true)}
                          className="inline-flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-[4px] text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          <Plus className="w-4 h-4" />
                          Add Rule
                        </button>
                      </div>
                    )}

                    {/* Rule Edit Form */}
                    {isEditingRule && (
                      <div className="bg-white border border-gray-200 rounded-[4px] p-5 shadow-sm">
                        <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center justify-between">
                          <span>
                            {editingRuleIndex !== null
                              ? "Edit Rule"
                              : "New Rule"}
                          </span>
                          <button
                            title="close"
                            type="button"
                            onClick={() => {
                              setIsEditingRule(false);
                              setEditingRuleIndex(null);
                              setRuleForm({});
                            }}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <Field
                            label="Specific Plan"
                            icon={<Layers className="w-4 h-4" />}
                          >
                            <CustomSelect
                              options={[
                                { label: "All Plans", value: -1 },
                                ...(plans
                                  ? plans.map((p) => ({
                                      label: p.name,
                                      value: p.id,
                                    }))
                                  : []),
                              ]}
                              isSearchable
                              placeholder="All Plans"
                              value={
                                ruleForm.planId && plans
                                  ? {
                                      label:
                                        plans.find(
                                          (p) => p.id === ruleForm.planId,
                                        )?.name || "Unknown Plan",
                                      value: ruleForm.planId,
                                    }
                                  : { label: "All Plans", value: -1 }
                              }
                              onChange={(val) => {
                                const selected = val as Option<number>;
                                setRuleForm((prev) => ({
                                  ...prev,
                                  planId:
                                    selected?.value === -1
                                      ? undefined
                                      : selected?.value,
                                }));
                              }}
                            />
                          </Field>

                          <Field
                            label="Billing Cycle"
                            icon={<Calendar className="w-4 h-4" />}
                          >
                            <CustomSelect
                              options={[
                                { label: "Any Cycle", value: "ANY" },
                                { label: "Monthly", value: "MONTHLY" },
                                { label: "Yearly", value: "YEARLY" },
                              ]}
                              placeholder="Any Cycle"
                              value={
                                ruleForm.interval
                                  ? {
                                      label:
                                        ruleForm.interval === "MONTHLY"
                                          ? "Monthly"
                                          : "Yearly",
                                      value: ruleForm.interval,
                                    }
                                  : { label: "Any Cycle", value: "ANY" }
                              }
                              onChange={(val) => {
                                const selected = val as Option<string>;
                                setRuleForm((prev) => ({
                                  ...prev,
                                  interval:
                                    selected?.value === "ANY"
                                      ? undefined
                                      : (selected?.value as BillingInterval),
                                }));
                              }}
                            />
                          </Field>

                          <Field
                            label="Region (Code)"
                            icon={<MapPin className="w-4 h-4" />}
                          >
                            <input
                              type="text"
                              value={ruleForm.region || ""}
                              onChange={(e) =>
                                setRuleForm((prev) => ({
                                  ...prev,
                                  region: e.target.value.toUpperCase(),
                                }))
                              }
                              placeholder="NG"
                              className="mt-1 w-full outline-none rounded-[4px] border border-gray-300 px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-60"
                            />
                          </Field>

                          <Field
                            label="Currency Constraint"
                            icon={<DollarSign className="w-4 h-4" />}
                          >
                            <CustomSelect
                              options={[
                                { label: "Any Currency", value: "ANY" },
                                ...Object.keys(currencyList).map((c) => ({
                                  label: c,
                                  value: c,
                                })),
                              ]}
                              value={
                                ruleForm.currency
                                  ? {
                                      label: ruleForm.currency,
                                      value: ruleForm.currency,
                                    }
                                  : { label: "Any Currency", value: "ANY" }
                              }
                              onChange={(val) => {
                                const selected = val as Option<string>;
                                setRuleForm((prev) => ({
                                  ...prev,
                                  currency:
                                    selected.value === "ANY"
                                      ? undefined
                                      : selected.value,
                                }));
                              }}
                              isSearchable
                              placeholder="Select Currency"
                            />
                          </Field>
                        </div>

                        <div className="mt-5 flex justify-end gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              setIsEditingRule(false);
                              setEditingRuleIndex(null);
                              setRuleForm({});
                            }}
                            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleRuleSubmit}
                            className="bg-primary text-white px-4 py-2 rounded-[4px] text-sm font-medium hover:bg-primary/90"
                          >
                            {editingRuleIndex !== null
                              ? "Update Rule"
                              : "Add Rule"}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Add button when list is shown and not editing */}
                    {!isEditingRule && form.rules.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setRuleForm({});
                          setEditingRuleIndex(null);
                          setIsEditingRule(true);
                        }}
                        className="w-full py-3 border border-dashed border-gray-300 rounded-[4px] text-sm text-gray-500 hover:text-primary hover:border-primary hover:bg-primary/5 transition flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Another Rule
                      </button>
                    )}
                  </div>
                )}
              </form>
            </div>

            {/* Footer */}
            {activeTab === "details" ? (
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
                  type="submit"
                  form="coupon-form"
                  disabled={isLoading}
                  className="rounded-[4px] bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-60"
                >
                  {isLoading
                    ? "Saving..."
                    : mode === "create" || mode === "duplicate"
                      ? "Create Coupon"
                      : "Save Changes"}
                </button>
              </div>
            ) : (
              // Navigation footer for rules tab (optional, can just point back to details or allow submit)
              <div className="flex justify-between gap-3 px-6 py-4 border-t border-gray-200 bg-white">
                <button
                  type="button"
                  onClick={() => setActiveTab("details")}
                  className="text-sm text-gray-500 hover:text-gray-700 font-medium"
                >
                  &larr; Back to Details
                </button>
                <div className="flex gap-3">
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
                    form="coupon-form"
                    disabled={isLoading}
                    className="rounded-[4px] bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-60"
                  >
                    {isLoading
                      ? "Saving..."
                      : mode === "create" || mode === "duplicate"
                        ? "Create Coupon"
                        : "Save Changes"}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditCouponDialog;

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
