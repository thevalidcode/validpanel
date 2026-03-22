import ImageUploadBox from "@/components/ImageUploadBox";
import { useAppContext } from "@/context/useAppContext";
import { useUpdateMe } from "@/hooks/use-admin";
import React, { useEffect, useState, type JSX } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function AdminAccount(): JSX.Element {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const { mutateAsync: updateAdmin } = useUpdateMe();
  const { adminInfo } = useAppContext();

  useEffect(() => {
    if (adminInfo) {
      setEmail(adminInfo.email || "");
      setImage(adminInfo.image || "");

      const fullName = adminInfo.fullName || "";
      const [first, ...rest] = fullName.split(" ");
      setFirstName(first || "");
      setLastName(rest.join(" ") || "");
    }
  }, [adminInfo]);

  const handleSave = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    await updateAdmin({
      email,
      fullName: `${firstName} ${lastName}`.trim(),
      image,
    });
    toast.success("Changes saved successfully!");
  };
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 min-h-screen"
    >
      <div className="mx-auto bg-white shadow-sm rounded-[4px] p-8">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-3 font-semibold text-lg"
        >
          Profile Picture
        </motion.p>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-4 mb-8"
        >
          <img
            src={image || "/Sarah.png"}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover"
          />

          <ImageUploadBox
            collection="admins"
            variant="button"
            buttonLabel="Upload New Picture"
            description="JPG, PNG or GIF. Max size 2MB."
            onUploaded={(url) => setImage(url)}
          />
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          onSubmit={handleSave}
          className="space-y-6 w-full"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                title="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full border border-gray-300 rounded-[4px] px-3 py-2 focus:ring-1 focus:ring-purple-500 focus:outline-none"
              />
            </motion.div>

            {/* Last Name */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                title="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full border border-gray-300 rounded-[4px] px-3 py-2 focus:ring-1 focus:ring-purple-500 focus:outline-none"
              />
            </motion.div>
          </div>

          {/* Email */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              title="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-[4px] px-3 py-2 focus:ring-1 focus:ring-purple-500 focus:outline-none"
            />
          </motion.div>

          {/* Password Section */}
          <div className="border border-gray-200 rounded-[4px] p-4 bg-gray-50">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-700">Password</p>
                {/* <p className="text-xs text-gray-500">
                  Last changed 3 months ago
                </p> */}
              </div>
              <button
                type="button"
                onClick={() => navigate("/admin/forgot-password")}
                className="text-sm text-purple-600 hover:underline font-medium"
              >
                Change Password
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              For security reasons, we recommend changing your password
              regularly.
            </p>
          </div>
          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex justify-end pt-4"
          >
            <button
              type="submit"
              className="bg-purple-600 text-white px-5 py-2 rounded-[4px] text-sm font-medium hover:bg-purple-700 transition"
            >
              Save Changes
            </button>
          </motion.div>
        </motion.form>
      </div>
    </motion.div>
  );
}
