import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import type { BillingInterval } from "@/types";
import CustomSelect, { type Option } from "@/components/ui/CustomSelect";
import CustomCheckbox from "@/components/ui/CustomCheckbox";
import { currency as currencyMap, getCurrencySymbol } from "@/_docs/doc";
import {
  CurrencyEuroIcon,
  PercentBadgeIcon,
} from "@heroicons/react/24/outline";
import type { CreatePlanPriceData } from "@/hooks/use-subscription-plan";
import { Field } from "./EditSubscriptionPlanDialog";

export default function PriceEditForm({
  initialData,
  onSubmit,
  onCancel,
  mode,
}: {
  initialData?: CreatePlanPriceData;
  onSubmit: (data: CreatePlanPriceData) => void;
  onCancel: () => void;
  mode: "create" | "edit";
}) {
  const [data, setData] = useState<CreatePlanPriceData>({
    interval: "MONTHLY",
    price: "",
    tax: null,
    amountInMinor: 0,
    currency: "USD",
    isActive: true,
    isDefault: false,
  });

  useEffect(() => {
    if (initialData) {
      setData(initialData);
    } else {
      setData({
        interval: "MONTHLY",
        price: "",
        tax: null,
        amountInMinor: 0,
        currency: "USD",
        isActive: true,
        isDefault: false,
      });
    }
  }, [initialData]);

  const currencyOptions: Option<string>[] = Object.keys(currencyMap).map(
    (code) => ({
      label: `${code} (${getCurrencySymbol(code)})`,
      value: code,
    }),
  );

  const intervalOptions: Option<BillingInterval>[] = [
    { label: "Monthly", value: "MONTHLY" },
    { label: "Yearly", value: "YEARLY" },
  ];

  const handleSubmit = () => {
    if (!data.price || !data.currency) return;
    // Calculate amountInMinor if not set (or assume backend handles parsing string)
    // Here we'll just mock it or assume user input
    // Ideally we parse price * 100 for standard currencies
    const minor = Math.round(parseFloat(data.price || "0") * 100);
    onSubmit({ ...data, amountInMinor: minor });
  };

  return (
    <div className="p-4 border border-dashed border-gray-300 rounded-[4px] bg-gray-50/50 mt-4">
      <h4 className="text-sm font-semibold mb-3">
        {mode === "edit" ? "Edit Price" : "Add New Price"}
      </h4>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <Field label="Price" icon={getCurrencySymbol(data.currency)}>
          <input
            type="text"
            value={data.price}
            onChange={(e) => setData({ ...data, price: e.target.value })}
            className="w-full border outline-none border-gray-300 rounded-[4px] px-2 py-1.5 text-sm focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
            placeholder="0.00"
          />
        </Field>
        <Field label="Currency" icon={<CurrencyEuroIcon className="w-4 h-4" />}>
          <CustomSelect
            options={currencyOptions}
            isSearchable
            value={currencyOptions.find((c) => c.value === data.currency)}
            onChange={(opt: any) =>
              setData({ ...data, currency: opt?.value || "USD" })
            }
          />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <Field label="Interval" icon={<Clock className="w-4 h-4" />}>
          <CustomSelect
            options={intervalOptions}
            value={intervalOptions.find((c) => c.value === data.interval)}
            onChange={(opt: any) =>
              setData({ ...data, interval: opt?.value || "MONTHLY" })
            }
          />
        </Field>
        <Field label="Tax (%)" icon={<PercentBadgeIcon className="w-4 h-4" />}>
          <input
            type="text"
            value={data.tax ?? ""}
            onChange={(e) =>
              setData({
                ...data,
                tax: e.target.value ? parseFloat(e.target.value) : null,
              })
            }
            className="w-full border outline-none border-gray-300 rounded-[4px] px-2 py-1.5 text-sm focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
            placeholder="0"
          />
        </Field>
      </div>

      <div className="flex gap-4 mb-4">
        <CustomCheckbox
          label="Active"
          checked={data.isActive ?? false}
          onChange={(checked) => setData({ ...data, isActive: checked })}
        />
        <CustomCheckbox
          label="Default"
          checked={data.isDefault ?? false}
          onChange={(checked) => setData({ ...data, isDefault: checked })}
        />
      </div>

      <div className="flex justify-end gap-2">
        {mode === "edit" && (
          <button
            onClick={onCancel}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Cancel Edit
          </button>
        )}
        <button
          type="button"
          onClick={handleSubmit}
          className="bg-gray-900 text-white px-3 py-1.5 rounded-[4px] text-xs font-medium"
        >
          {mode === "edit" ? "Update Price" : "Add Price"}
        </button>
      </div>
    </div>
  );
}
