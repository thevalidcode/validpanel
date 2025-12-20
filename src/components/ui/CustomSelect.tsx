import { useState, useRef, useEffect,  } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, X } from "lucide-react";

export interface Option<T = any> {
  label: string;
  value: T;
}

interface CustomSelectProps<T = any> {
  options: Option<T>[];
  placeholder?: string;
  value?: Option<T> | Option<T>[];
  onChange: (value: Option<T> | Option<T>[]) => void;
  isMulti?: boolean;
  isSearchable?: boolean;
  disabled?: boolean;
  className?: string;
}

const CustomSelect = <T,>({
  options,
  placeholder = "Select...",
  value,
  onChange,
  isMulti = false,
  isSearchable = false,
  disabled = false,
  className = "",
}: CustomSelectProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => !disabled && setIsOpen(!isOpen);

  const handleSelect = (option: Option<T>) => {
    if (isMulti) {
      if (Array.isArray(value)) {
        const exists = value.find((v) => v.value === option.value);
        if (exists) {
          onChange(value.filter((v) => v.value !== option.value));
        } else {
          onChange([...value, option]);
        }
      } else {
        onChange([option]);
      }
    } else {
      onChange(option);
      setIsOpen(false);
    }
  };

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleClickOutside = (e: MouseEvent) => {
    if (!containerRef.current?.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${className} font-inter text-sm`}
    >
      <button
        type="button"
        className={`w-full px-4 py-2 border rounded-lg text-left flex items-center justify-between cursor-pointer transition
          ${
            disabled
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white border-gray-300 hover:border-primary"
          }
        `}
        onClick={toggleDropdown}
        disabled={disabled}
      >
        <div className="flex flex-wrap gap-1">
          {isMulti && Array.isArray(value) && value.length > 0 ? (
            value.map((v) => (
              <span
                key={v.value as string | number}
                className="bg-primary/10 text-primary px-2 py-0.5 rounded flex items-center gap-1"
              >
                {v.label}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(v);
                  }}
                />
              </span>
            ))
          ) : !isMulti && value ? (
            <span>{(value as Option<T>).label}</span>
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto"
          >
            {isSearchable && (
              <div className="p-2 border-b border-gray-100">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  placeholder="Search..."
                />
              </div>
            )}

            {filteredOptions.length === 0 ? (
              <div className="p-3 text-gray-400">No options found</div>
            ) : (
              filteredOptions.map((opt) => {
                const selected = isMulti
                  ? Array.isArray(value) &&
                    value.some((v) => v.value === opt.value)
                  : value && (value as Option<T>).value === opt.value;
                return (
                  <div
                    key={opt.value as string | number}
                    onClick={() => handleSelect(opt)}
                    className={`px-4 py-2 cursor-pointer transition flex items-center justify-between
                      ${
                        selected
                          ? "bg-primary/10 text-primary font-medium"
                          : "hover:bg-gray-50"
                      }
                    `}
                  >
                    {opt.label}
                  </div>
                );
              })
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomSelect;
