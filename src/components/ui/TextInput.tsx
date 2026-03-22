import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputComponentProps extends InputHTMLAttributes<HTMLInputElement> {
  styles?: string;
}

const TextInput = forwardRef<HTMLInputElement, InputComponentProps>(
  ({ styles, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";

    if (isPassword) {
      return (
        <div className="relative w-full">
          <input
            {...props}
            type={showPassword ? "text" : "password"}
            ref={ref}
            className={`w-full rounded-[4px] outline-none border border-gray-200 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] px-4 py-3 placeholder:text-gray-400 text-gray-700 transition-all pr-12 ${
              styles || ""
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none p-1 rounded-full hover:bg-gray-100 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      );
    }

    return (
      <input
        {...props}
        type={type}
        ref={ref}
        className={`w-full rounded-[4px] outline-none border border-gray-200 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] px-4 py-3 placeholder:text-gray-400 text-gray-700 transition-all ${
          styles || ""
        }`}
      />
    );
  }
);

TextInput.displayName = "TextInput";

export default TextInput;
