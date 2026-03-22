import ImageUploadBox from "@/components/ImageUploadBox";
import CustomSelect, { type Option } from "@/components/ui/CustomSelect";
import { useAppContext } from "@/context/useAppContext";
import { useUpdateUser } from "@/hooks/use-user";
import React, { useEffect, useState, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { currency as currencyMap, getCurrencySymbol } from "@/_docs/doc";

export default function UserSettings(): JSX.Element {
  const [firstName, setFirstName] = useState<string>("Sarah");
  const [lastName, setLastName] = useState<string>("Johnson");
  const [email, setEmail] = useState<string>("sarah.johnson@example.com");
  const [phone, setPhone] = useState<string>("+1 (505) 123-4567");
  const [image, setImage] = useState<string>("");
  const navigate = useNavigate();
  const { mutateAsync: updateUser } = useUpdateUser();
  const { userInfo, setUserCurrency, userCurrency } = useAppContext();

  useEffect(() => {
    if (userInfo) {
      setEmail(userInfo.email || "");
      setPhone(userInfo.phoneNumber || "");
      setImage(userInfo.image || "");

      const fullName = userInfo.fullName || "";
      const [first, ...rest] = fullName.split(" ");
      setFirstName(first || "");
      setLastName(rest.join(" ") || "");
    }
  }, [userInfo]);

  const handleSave = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    await updateUser({
      phoneNumber: phone,
      fullName: lastName + " " + firstName,
      image,
    });
    toast.success("Changes saved successfully!");
  };

  const currencyOptions: Option<string>[] = Object.keys(currencyMap).map(
    (code) => ({
      label: `${code} (${getCurrencySymbol(code)})`,
      value: code,
    }),
  );

  return (
    <div className="p-6 min-h-screen space-y-8">
      <div className="mx-auto bg-white shadow-sm rounded-[4px] p-8">
        <p className="mb-3 font-semibold text-lg">Profile Picture</p>
        <div className="flex items-center gap-4 mb-8">
          <img
            src={image || "Sarah.png"}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover"
          />

          <ImageUploadBox
            collection="users"
            variant="button"
            buttonLabel="Upload New Picture"
            description="JPG, PNG or GIF. Max size 2MB."
            onUploaded={(url) => setImage(url)}
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-6 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
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
            </div>

            {/* Last Name */}
            <div>
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
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                title="email"
                value={email}
                disabled
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-[4px] px-3 py-2 focus:ring-1 focus:ring-purple-500 focus:outline-none"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                title="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-gray-300 rounded-[4px] px-3 py-2 focus:ring-1 focus:ring-purple-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Currency Section */}
          <div className="flex flex-col">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Currency
            </label>
            <CustomSelect
              options={currencyOptions}
              value={
                userCurrency
                  ? currencyOptions.find((opt) => opt.value === userCurrency)
                  : undefined
              }
              placeholder="Currency"
              onChange={(selected) => {
                const option = selected as Option<string>;
                setUserCurrency(option.value as keyof typeof currencyMap);
              }}
              className="w-full"
              isSearchable
            />
          </div>

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
                onClick={() => navigate("/forgot-password")}
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
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="bg-purple-600 text-white px-5 py-2 rounded-[4px] text-sm font-medium hover:bg-purple-700 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
