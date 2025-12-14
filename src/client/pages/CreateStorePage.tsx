import React, { useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "../components/Layout";
import { useCreateStore } from "@/hooks/use-store";
import type { StoreType } from "@/types";
import LivePreview from "../components/stores/LivePreview";
import DomainInput from "../components/DomainInput";
import ImageUploadBox from "@/components/ImageUploadBox";

const CreateStoreForm: React.FC = () => {
  const [storeType, setStoreType] = useState<StoreType>("SHOP");
  const [brandColor, setBrandColor] = useState<string>("#6D28D9");
  const [storeName, setStoreName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [domain, setDomain] = useState<string>("");
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [useCustomDomain, setUseCustomDomain] = useState<boolean>(false);

  const { mutateAsync: createStore } = useCreateStore();
  const navigate = useNavigate();

  const brandColors: string[] = [
    "#4C1D95",
    "#5B21B6",
    "#6D28D9",
    "#7C3AED",
    "#8B5CF6",
    "#A78BFA",
    "#C4B5FD",
    "#EDE9FE",
    "#f97316",
  ];

  const handleCreate = async (): Promise<void> => {
    if (!storeName.trim() || !domain.trim()) return; // required field validation
    const parsedDomain = useCustomDomain ? domain : domain + ".validpanel.com";
    await createStore({
      type: storeType,
      name: storeName,
      description: description || undefined,
      domain: parsedDomain,
      logoUrl,
      color: brandColor,
      subscriptionId: 1, // Change this as needed
    });
    navigate("/analytics");
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) =>
    setStoreName(e.target.value);
  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) =>
    setDescription(e.target.value);
  const handleToggleDomain = (): void => setUseCustomDomain((prev) => !prev);

  return (
    <Layout
      title="Create Store"
      description="Create a shop or a social media store"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col lg:flex-row justify-center items-start gap-8 p-4 sm:p-6 lg:p-10"
      >
        <div className="flex flex-col lg:flex-row gap-8 w-full max-w-5xl">
          {/* Left Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white p-6 sm:p-8 flex-1 rounded-xl shadow-md"
          >
            <h2 className="text-2xl font-bold mb-2 text-center">
              Create a New Store
            </h2>
            <p className="text-gray-500 mb-6 text-center text-sm sm:text-base">
              Set up a new store by filling in the details below.
            </p>

            <div className="mb-6 rounded-lg p-4 sm:p-6">
              {/* Store Type */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                {(["SHOP", "SOCIAL"] as const).map((type) => (
                  <button
                    key={type}
                    className={`flex-1 border rounded-lg py-6 sm:py-8 text-center transition-all duration-200 ${
                      storeType === type
                        ? "border-purple-500 bg-purple-50 text-primary"
                        : "border-gray-200 text-gray-700 hover:border-purple-200"
                    }`}
                    onClick={() => setStoreType(type)}
                  >
                    <img
                      src={type === "SHOP" ? "/Shop2.svg" : "/Link.svg"}
                      alt={type}
                      className="mx-auto w-5 mb-2"
                    />
                    <span className="font-medium capitalize">
                      {type === "SOCIAL" ? "Social Media Store" : "Shop"}
                    </span>
                    <p className="text-xs text-gray-400">
                      {type === "SHOP"
                        ? "Traditional e-commerce store"
                        : "Social media marketing platform"}
                    </p>
                  </button>
                ))}
              </div>

              {/* Store Name */}
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Store Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter your store name"
                value={storeName}
                onChange={handleNameChange}
                required
                className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

              {/* Description */}
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <textarea
                placeholder="Enter a short description of your store"
                value={description}
                onChange={handleDescriptionChange}
                className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                rows={3}
              />

              {/* Domain Setup */}
              <DomainInput
                value={domain}
                onChange={setDomain}
                useCustomDomain={useCustomDomain}
                onToggleCustomDomain={handleToggleDomain}
                required
              />

              <ImageUploadBox
                label="Brand Logo (Optional)"
                collection="store"
                onUploaded={(url) => setLogoUrl(url)}
              />

              {/* Brand Color */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand Color <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-3">
                  {brandColors.map((color) => (
                    <button
                      title="color"
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded-lg border-2 transition-all duration-150 ${
                        brandColor === color
                          ? "border-gray-600 scale-105"
                          : "border-transparent"
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setBrandColor(color)}
                    />
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="border cursor-pointer border-purple-500 text-purple-500 rounded-md px-4 py-2 hover:bg-purple-50 w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreate}
                  title="create-store"
                  className="bg-purple-600 cursor-pointer text-white rounded-md px-4 py-2 hover:bg-primary w-full sm:w-auto flex items-center gap-2 animate-pulse hover:animate-none"
                >
                  <img src="/Jet.svg" alt="Jet" /> <span>Create Store</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Live Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full lg:w-1/3"
          >
            <LivePreview
              storeName={storeName}
              brandColor={brandColor}
              useCustomDomain={useCustomDomain}
              domain={domain}
              logoUrl={logoUrl}
            />
          </motion.div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default CreateStoreForm;
