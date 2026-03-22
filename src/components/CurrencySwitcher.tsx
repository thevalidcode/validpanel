import { motion } from "framer-motion";
import CustomSelect, { type Option } from "@/components/ui/CustomSelect";
import { currency as currencyMap, getCurrencySymbol } from "@/_docs/doc";
import { useAppContext } from "@/context/useAppContext";

interface CurrencySwitcherProps {
  className?: string;
}

export default function CurrencySwitcher({
  className = "",
}: CurrencySwitcherProps) {
  const { userCurrency, setUserCurrency } = useAppContext();

  const currencyOptions: Option<string>[] = Object.keys(currencyMap).map(
    (code) => ({
      label: `${code} (${getCurrencySymbol(code)})`,
      value: code,
    }),
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className={`flex items-center gap-3 ${className}`}
    >
      <div className="min-w-[180px]">
        <CustomSelect
          options={currencyOptions}
          value={
            userCurrency
              ? currencyOptions.find((opt) => opt.value === userCurrency)
              : undefined
          }
          placeholder="Select Currency"
          onChange={(selected) => {
            const option = selected as Option<string>;
            setUserCurrency(option.value);
          }}
          isSearchable
        />
      </div>
    </motion.div>
  );
}
