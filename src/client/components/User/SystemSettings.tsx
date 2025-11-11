import { Bars3Icon } from "@heroicons/react/24/outline";
import React, { useState, type ChangeEvent, type FormEvent } from "react";

interface AdminSettingsProps {
  onMenuClick?: () => void;
}

interface ThrottleOptions {
  progressiveDelays: boolean;
  banRepeat: boolean;
  notifyAdmins: boolean;
  whitelistIPs: boolean;
}

export default function AdminSettings({ onMenuClick }: AdminSettingsProps) {
  const [siteName, setSiteName] = useState<string>("My Application");
  const [adminEmail, setAdminEmail] = useState<string>("admin@example.com");
  const [currency, setCurrency] = useState<string>("USD - US Dollar");
  const [timezone, setTimezone] = useState<string>("UTC");
  const [siteDesc, setSiteDesc] = useState<string>(
    "A modern web application for managing your business operations efficiently."
  );
  const [language, setLanguage] = useState<string>("English");
  const [dateFormat, setDateFormat] = useState<string>("MM/DD/YYYY");

  const [maintenanceEnabled, setMaintenanceEnabled] = useState<boolean>(false);
  const [maintenanceMsg, setMaintenanceMsg] = useState<string>(
    "We are currently performing scheduled maintenance. Please check back soon."
  );
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [allowedIPs, setAllowedIPs] = useState<string>("");

  const [rpm, setRpm] = useState<number>(60);
  const [rph, setRph] = useState<number>(1000);
  const [rpd, setRpd] = useState<number>(10000);

  const [maxLoginAttempts, setMaxLoginAttempts] = useState<number>(5);
  const [lockoutDuration, setLockoutDuration] = useState<number>(15);

  const [maxFileSize, setMaxFileSize] = useState<number>(10);
  const [uploadsPerHour, setUploadsPerHour] = useState<number>(20);
  const [concurrentUploads, setConcurrentUploads] = useState<number>(3);

  const [throttleOptions, setThrottleOptions] = useState<ThrottleOptions>({
    progressiveDelays: true,
    banRepeat: false,
    notifyAdmins: true,
    whitelistIPs: false,
  });

  const handleSave = (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    alert("Settings saved successfully (demo)");
  };

  const handleNumberChange = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setter(Number(e.target.value));
  };

  const toggleThrottleOption = (key: keyof ThrottleOptions) => {
    setThrottleOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="w-full bg-gray-100">
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <button
          className="md:hidden text-gray-700 hover:text-purple-700"
          onClick={onMenuClick}
        >
          <Bars3Icon className="w-6 h-6" />
        </button>

        <h2 className="hidden lg:block text-2xl font-bold">System Settings</h2>

        <div className="flex items-center gap-2">
          <img
            src="Sarah.png"
            alt="profile"
            className="w-10 h-10 rounded-full object-cover"
          />
          <p className="font-medium text-gray-800">Sarah Johnson</p>
        </div>
      </header>

      <form onSubmit={handleSave} className="space-y-8 p-6">
        <section className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            General Settings
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Configure your application’s general preferences.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Site Name
              </label>
              <input
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Admin Email
              </label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Default Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
              >
                <option>USD - US Dollar</option>
                <option>EUR - Euro</option>
                <option>GBP - British Pound</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Timezone
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
              >
                <option>UTC</option>
                <option>UTC+1</option>
                <option>UTC-5</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Site Description
              </label>
              <textarea
                rows={2}
                value={siteDesc}
                onChange={(e) => setSiteDesc(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Default Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
              >
                <option>English</option>
                <option>French</option>
                <option>Spanish</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Format
              </label>
              <select
                value={dateFormat}
                onChange={(e) => setDateFormat(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
              >
                <option>MM/DD/YYYY</option>
                <option>DD/MM/YYYY</option>
              </select>
            </div>
          </div>
        </section>

        <section className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Maintenance Mode
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Control when your application goes offline for updates.
          </p>

          <label className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              checked={maintenanceEnabled}
              onChange={() => setMaintenanceEnabled(!maintenanceEnabled)}
              className="h-4 w-4 text-purple-600 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700 font-medium">
              Enable maintenance mode
            </span>
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Maintenance Message
              </label>
              <textarea
                rows={2}
                value={maintenanceMsg}
                onChange={(e) => setMaintenanceMsg(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Allowed IPs
              </label>
              <input
                value={allowedIPs}
                onChange={(e) => setAllowedIPs(e.target.value)}
                placeholder="e.g., 192.168.1.1, 127.0.0.1"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
              />
            </div>
          </div>
        </section>

        <section className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Rate Limits & Throttling
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Manage API and user activity rate limits.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Requests per Minute
              </label>
              <input
                type="number"
                value={rpm}
                onChange={(e) => handleNumberChange(setRpm, e)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Requests per Hour
              </label>
              <input
                type="number"
                value={rph}
                onChange={(e) => handleNumberChange(setRph, e)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Requests per Day
              </label>
              <input
                type="number"
                value={rpd}
                onChange={(e) => handleNumberChange(setRpd, e)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
              />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Login Attempts
              </label>
              <input
                type="number"
                value={maxLoginAttempts}
                onChange={(e) => handleNumberChange(setMaxLoginAttempts, e)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lockout Duration (mins)
              </label>
              <input
                type="number"
                value={lockoutDuration}
                onChange={(e) => handleNumberChange(setLockoutDuration, e)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
              />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max File Size (MB)
              </label>
              <input
                type="number"
                value={maxFileSize}
                onChange={(e) => handleNumberChange(setMaxFileSize, e)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Uploads per Hour
              </label>
              <input
                type="number"
                value={uploadsPerHour}
                onChange={(e) => handleNumberChange(setUploadsPerHour, e)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Concurrent Uploads
              </label>
              <input
                type="number"
                value={concurrentUploads}
                onChange={(e) => handleNumberChange(setConcurrentUploads, e)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
              />
            </div>
          </div>

          {/* Throttle Options */}
          <div className="mt-6 space-y-2">
            {(Object.keys(throttleOptions) as Array<keyof ThrottleOptions>).map(
              (key) => (
                <label key={key} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={throttleOptions[key]}
                    onChange={() => toggleThrottleOption(key)}
                    className="h-4 w-4 text-purple-600 border-gray-300 rounded"
                  />
                  <span className="capitalize text-sm text-gray-700 font-medium">
                    {key.replace(/([A-Z])/g, " $1")}
                  </span>
                </label>
              )
            )}
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-purple-600 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
