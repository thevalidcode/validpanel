import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface CustomCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
  size?: "sm" | "md";
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
  className = "",
  size = "md",
}: CustomCheckboxProps) => {
  const styles = sizeMap[size];

  const toggle = () => {
    if (!disabled) onChange(!checked);
  };

  return (
    <label
      className={`inline-flex items-center gap-2 cursor-pointer select-none ${className}
        ${disabled ? "opacity-60 cursor-not-allowed" : ""}
      `}
      onClick={toggle}
    >
      <div
        className={`relative flex items-center justify-center rounded-md border transition
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

      {label && <span className={`text-gray-700 ${styles.text}`}>{label}</span>}
    </label>
  );
};

export default CustomCheckbox;
