import type { FC, ChangeEvent } from "react";
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
}

const ImageUploadBox: FC<ImageUploadBoxProps> = ({
  label = "Upload Image",
  collection,
  onUploaded,
  accept = "image/png, image/jpeg",
  maxSizeMB = 5,
}) => {
  const { mutate: uploadImage, isPending } = useUploadImage();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeMB = file.size / 1024 / 1024;
    if (sizeMB > maxSizeMB) {
      toast.error(`Image must be smaller than ${maxSizeMB}MB`);
      return;
    }

    uploadImage(
      { file, collection },
      {
        onSuccess: (data) => {
          if (data?.url) {
            onUploaded(data.url);
          }
        },
      }
    );
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>

      <motion.label
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-purple-400 transition"
      >
        <Upload className="w-10 h-10 text-gray-400 mb-2" />
        <p className="text-gray-400 text-sm">
          {isPending ? "Uploading..." : `PNG, JPG up to ${maxSizeMB}MB`}
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
