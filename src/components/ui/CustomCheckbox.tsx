import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { ReactNode } from "react";

interface CustomCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: ReactNode;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  size?: "sm" | "md";
  name?: string;
  id?: string;
}

const sizeMap = {
  sm: {
    box: "w-4 h-4",
    icon: "w-3 h-3",
    text: "text-sm",
  },
  md: {
    box: "w-5 h-5",
    icon: "w-4 h-4",
    text: "text-sm",
  },
};

const CustomCheckbox = ({
  checked,
  onChange,
  label,
  disabled = false,
  required = true,
  className = "",
  size = "md",
  name,
  id,
}: CustomCheckboxProps) => {
  const styles = sizeMap[size];

  return (
    <label
      className={`inline-flex items-center gap-2 cursor-pointer select-none ${className}
        ${disabled ? "opacity-60 cursor-not-allowed" : ""}
      `}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        name={name}
        id={id}
        required={required}
        className="sr-only"
      />
      <div
        className={`relative flex items-center justify-center rounded-[4px] border transition
          ${styles.box}
          ${
            checked
              ? "bg-primary border-primary"
              : "bg-white border-gray-300 hover:border-primary"
          }
        `}
      >
        <motion.div
          initial={false}
          animate={{
            scale: checked ? 1 : 0,
            opacity: checked ? 1 : 0,
          }}
          transition={{ duration: 0.15 }}
        >
          <Check className={`${styles.icon} text-white`} />
        </motion.div>
      </div>

      {label &&
        (typeof label === "string" ? (
          <span className={`text-gray-700 ${styles.text}`}>{label}</span>
        ) : (
          label
        ))}
    </label>
  );
};

export default CustomCheckbox;
