import type { FC } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DomainInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;

  useCustomDomain: boolean;
  showUseCustomDomain?: boolean;
  onToggleCustomDomain: () => void;

  required?: boolean;
  defaultSuffix?: string; // e.g. ".validpanel.com"
  customPlaceholder?: string;
  subdomainPlaceholder?: string;

  nsRecords?: string[]; // dynamic name servers
  supportText?: string;
}

const DomainInput: FC<DomainInputProps> = ({
  label = "Domain",
  value,
  onChange,
  useCustomDomain,
  onToggleCustomDomain,
  showUseCustomDomain = true,
  required = false,
  defaultSuffix = ".validpanel.com",
  customPlaceholder = "yourcustomdomain.com",
  subdomainPlaceholder = "yourstore",
  nsRecords = ["ns1.validpanel.com", "ns2.validpanel.com"],
  supportText = "If you cannot update your name servers, please contact support before creating the store.",
}) => {
  return (
    <div className="mb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-2">
        <label className="block text-gray-700 font-medium text-sm sm:text-base">
          {label} {required && <span className="text-red-500">*</span>}
        </label>

        {showUseCustomDomain && (
          <div
            onClick={onToggleCustomDomain}
            className="flex items-center space-x-2 cursor-pointer select-none"
          >
            <span className="text-xs sm:text-sm text-gray-600">
              Use custom domain
            </span>
            <div
              className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${
                useCustomDomain ? "bg-purple-600" : "bg-gray-300"
              }`}
            >
              <div
                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${
                  useCustomDomain ? "right-0.5" : "left-0.5"
                }`}
              />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={
            useCustomDomain ? customPlaceholder : subdomainPlaceholder
          }
          className="flex-1 border border-gray-300 rounded-t-md sm:rounded-l-md sm:rounded-t-none px-4 py-2 text-sm sm:text-base focus:outline-none focus:border-purple-500"
          required={required}
        />

        {!useCustomDomain && (
          <span className="border border-gray-300 border-t-0 sm:border-t sm:border-l-0 bg-gray-50 text-gray-600 px-3 py-2 rounded-b-md sm:rounded-r-md sm:rounded-b-none text-xs sm:text-sm text-center">
            {defaultSuffix}
          </span>
        )}
      </div>

      {/* Warning */}
      <AnimatePresence>
        {useCustomDomain && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="mt-3 rounded-md border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-800"
          >
            <p className="font-medium mb-1">Custom domain setup required</p>
            <p className="text-xs sm:text-sm">
              Change your domain name servers to:
            </p>
            <ul className="mt-1 ml-4 list-disc text-xs sm:text-sm">
              {nsRecords.map((ns) => (
                <li key={ns}>{ns}</li>
              ))}
            </ul>
            <p className="mt-2 text-xs sm:text-sm">{supportText}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DomainInput;
