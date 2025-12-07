import React, { useState, type JSX } from "react";

export default function UserSettings(): JSX.Element {
  const [firstName, setFirstName] = useState<string>("Sarah");
  const [lastName, setLastName] = useState<string>("Johnson");
  const [email, setEmail] = useState<string>("sarah.johnson@example.com");
  const [phone, setPhone] = useState<string>("+1 (505) 123-4567");
  const [timezone, setTimezone] = useState<string>(
    "UTC-5 [Eastern Standard Time]"
  );
  const [language, setLanguage] = useState<string>("English (US)");

  const handleSave = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    alert("Changes saved successfully!");
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="mx-auto bg-white shadow-sm rounded-lg p-8">
        <p className="mb-3 font-semibold text-lg">Profile Picture</p>
        <div className="flex items-center gap-4 mb-8">
          <img
            src="Sarah.png"
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <button className="border border-gray-300 px-4 py-2 rounded-md text-sm hover:bg-gray-100 transition">
              Upload New Picture
            </button>
            <p className="text-xs text-gray-500 mt-1">
              JPG, PNG or GIF. Max size 2MB.
            </p>
          </div>
        </div>

        {/* Account Type */}
        <div className="mb-8">
          <p className="text-gray-700 font-medium mb-2">Account Type</p>
          <span className="inline-block bg-purple-100 text-purple-700 text-xs font-medium px-3 py-1 rounded-xl">
            Shop Owner
          </span>
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
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
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
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
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
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
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
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Password Section */}
          <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-700">Password</p>
                <p className="text-xs text-gray-500">
                  Last changed 3 months ago
                </p>
              </div>
              <button
                type="button"
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

          {/* Timezone and Language */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Timezone
              </label>
              <select
                value={timezone}
                title="timezone"
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
              >
                <option>UTC-5 [Eastern Standard Time]</option>
                <option>UTC+0 [Greenwich Mean Time]</option>
                <option>UTC+1 [Central European Time]</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Language
              </label>
              <select
                value={language}
                title="language"
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
              >
                <option>English (US)</option>
                <option>English (UK)</option>
                <option>French</option>
                <option>Spanish</option>
              </select>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="bg-purple-600 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
