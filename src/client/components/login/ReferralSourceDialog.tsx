import { type FC, type FormEvent, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TrendingUp, Tag } from "lucide-react";
import CustomSelect, {
  type CustomSelectRef,
  type Option,
} from "@/components/ui/CustomSelect";
import { REFERRAL_SOURCES } from "@/constants/referralSources";

interface ReferralSourceDialogProps {
  open: boolean;
  isLoading?: boolean;
  onSubmit: (data: { referralSource: string; marketingData: Record<string, any> }) => void;
}

// Convert to CustomSelect options
const referralSourceOptions: Option<string>[] = REFERRAL_SOURCES.map(
  (source) => ({
    label: source,
    value: source,
  })
);

const ReferralSourceDialog: FC<ReferralSourceDialogProps> = ({
  open,
  isLoading = false,
  onSubmit,
}) => {
  const [referralSource, setReferralSource] = useState<Option<string> | null>(null);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const selectRef = useRef<CustomSelectRef>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const isValid = selectRef.current?.validate();
    if (isValid && referralSource) {
      const marketingData: Record<string, any> = {
        source: referralSource.value,
        timestamp: new Date().toISOString(),
      };

      if (additionalInfo.trim()) {
        marketingData.additionalInfo = additionalInfo.trim();
      }

      onSubmit({
        referralSource: referralSource.value,
        marketingData,
      });
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.form
            onSubmit={handleSubmit}
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full max-w-md rounded-2xl bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-primary/5 to-purple-50">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  How did you hear about us?
                </h3>
                <p className="text-sm text-gray-600 mt-0.5">
                  Help us improve our marketing efforts
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-6 space-y-5">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Tag className="w-4 h-4 text-primary" />
                  Referral Source*
                </label>
                <CustomSelect
                  options={referralSourceOptions}
                  ref={selectRef}
                  value={referralSource || undefined}
                  required={true}
                  isSearchable={true}
                  placeholder="Select where you found us..."
                  onChange={(opt) => setReferralSource(opt as Option<string>)}
                />
                <p className="text-xs text-gray-500 mt-1.5">
                  This helps us understand which marketing channels work best
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Additional Details (Optional)
                </label>
                <textarea
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  placeholder="E.g., specific influencer name, blog post title, friend's name, etc."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition resize-none"
                  rows={3}
                  maxLength={500}
                />
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-gray-500">
                    Help us track specific campaigns or referrers
                  </p>
                  <span className="text-xs text-gray-400">
                    {additionalInfo.length}/500
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 rounded-b-2xl flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
              >
                {isLoading ? "Processing..." : "Continue"}
              </button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReferralSourceDialog;
