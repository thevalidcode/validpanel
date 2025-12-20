import type { FC, ChangeEvent, ReactNode } from "react";
import { Upload } from "lucide-react";
import { motion } from "framer-motion";
import { useUploadImage } from "@/hooks/use-file";
import type { CollectionName } from "@/types";
import { toast } from "sonner";

interface ImageUploadBoxProps {
  label?: string;
  collection: CollectionName;
  onUploaded: (url: string) => void;
  accept?: string;
  maxSizeMB?: number;
  variant?: "box" | "button"; // new
  buttonLabel?: string; // for button variant
  labelIcon?: ReactNode;
  description?: string; // optional description under button
}

const ImageUploadBox: FC<ImageUploadBoxProps> = ({
  label = "Upload Image",
  collection,
  onUploaded,
  accept = "image/png, image/jpeg",
  maxSizeMB = 5,
  variant = "box",
  labelIcon,
  buttonLabel = "Upload New Picture",
  description = `PNG, JPG up to ${maxSizeMB}MB`,
}) => {
  const { mutateAsync: uploadImage, isPending } = useUploadImage();

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeMB = file.size / 1024 / 1024;
    if (sizeMB > maxSizeMB) {
      toast.error(`Image must be smaller than ${maxSizeMB}MB`);
      return;
    }

    await uploadImage(
      { file, collection },
      {
        onSuccess: (data) => {
          if (data?.url) onUploaded(data.url);
        },
      }
    );
    toast.info("Image uploaded successfully, please save the changes.");
  };
  if (variant === "button") {
    return (
      <div className="flex flex-col items-start">
        <motion.label
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="border border-gray-300 px-4 py-2 rounded-md text-sm hover:bg-gray-100 transition cursor-pointer inline-flex items-center justify-center disabled:opacity-50"
        >
          {isPending ? "Uploading..." : buttonLabel}
          <input
            type="file"
            title="image"
            accept={accept}
            className="hidden"
            onChange={handleFileChange}
            disabled={isPending}
          />
        </motion.label>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </div>
    );
  }

  // Default "box" variant
  return (
    <div className="mb-6">
      <label className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
        {labelIcon && <span className="text-gray-400">{labelIcon}</span>}
        {label}
      </label>
      <motion.label
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-purple-400 transition"
      >
        <Upload className="w-10 h-10 text-gray-400 mb-2" />
        <p className="text-gray-400 text-sm">
          {isPending ? "Uploading..." : description}
        </p>

        <input
          title="image"
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleFileChange}
          disabled={isPending}
        />
      </motion.label>
    </div>
  );
};

export default ImageUploadBox;
