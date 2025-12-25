import React, {
  useState,
  useEffect,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { motion } from "framer-motion";
import CustomSelect, { type Option } from "@/components/ui/CustomSelect";
import CustomCheckbox from "@/components/ui/CustomCheckbox";
import { useGetSettings, useUpdateSettings } from "@/hooks/use-setting";

interface ThrottleOptions {
  progressiveDelays: boolean;
  blockSuspiciousIp: boolean;
  sendEmailAlerts: boolean;
  whitelistedIps: boolean;
}

export default function AdminSettings() {
  const { data: settingsData, isLoading } = useGetSettings();
  const updateSettingsMutation = useUpdateSettings();

  const [siteName, setSiteName] = useState<string>("");
  const [adminEmail, setAdminEmail] = useState<string>("");
  const [currency, setCurrency] = useState<string>("USD");
  const [timezone, setTimezone] = useState<string>("UTC");
  const [siteDesc, setSiteDesc] = useState<string>("");
  const [language, setLanguage] = useState<string>("English");
  const [dateFormat, setDateFormat] = useState<string>("MM/DD/YYYY");

  const [maintenanceEnabled, setMaintenanceEnabled] = useState<boolean>(false);
  const [maintenanceMsg, setMaintenanceMsg] = useState<string>("");
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
    blockSuspiciousIp: false,
    sendEmailAlerts: true,
    whitelistedIps: false,
  });

  useEffect(() => {
    if (settingsData) {
      setSiteName(settingsData.siteName || "");
      setAdminEmail(settingsData.adminEmail || "");
      setCurrency(settingsData.defaultCurrency || "USD");
      setTimezone(settingsData.timezone || "UTC");
      setSiteDesc(settingsData.siteDescription || "");
      setLanguage(settingsData.defaultLanguage || "English");
      setDateFormat(settingsData.dateFormat || "MM/DD/YYYY");

      setMaintenanceEnabled(settingsData.maintenanceMode === "ENABLED");
      setMaintenanceMsg(settingsData.maintenanceMsg || "");
      setStartDate(
        settingsData.maintenanceStart
          ? new Date(settingsData.maintenanceStart).toISOString().slice(0, 16)
          : ""
      );
      setEndDate(
        settingsData.maintenanceEnd
          ? new Date(settingsData.maintenanceEnd).toISOString().slice(0, 16)
          : ""
      );
      setAllowedIPs(
        settingsData.allowedIps ? settingsData.allowedIps.join(", ") : ""
      );

      setRpm(settingsData.requestsPerMinute || 60);
      setRph(settingsData.requestsPerHour || 1000);
      setRpd(settingsData.requestsPerDay || 10000);

      setMaxLoginAttempts(settingsData.maxLoginAttempts || 5);
      setLockoutDuration(settingsData.lockoutDuration || 15);

      setMaxFileSize(settingsData.maxFileSizeMb || 10);
      setUploadsPerHour(settingsData.uploadsPerHour || 20);
      setConcurrentUploads(settingsData.concurrentUploads || 3);

      setThrottleOptions({
        progressiveDelays: settingsData.progressiveDelays || true,
        blockSuspiciousIp: settingsData.blockSuspiciousIp || false,
        sendEmailAlerts: settingsData.sendEmailAlerts || true,
        whitelistedIps: !!settingsData.whitelistedIps?.length,
      });
    }
  }, [settingsData]);

  const handleSave = async (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    const data = {
      siteName,
      adminEmail,
      defaultCurrency: currency,
      timezone,
      siteDescription: siteDesc,
      defaultLanguage: language,
      dateFormat,
      maintenanceMode: maintenanceEnabled ? "ENABLED" : "DISABLED",
      maintenanceMsg,
      maintenanceStart: startDate ? new Date(startDate) : null,
      maintenanceEnd: endDate ? new Date(endDate) : null,
      allowedIps: allowedIPs
        ? allowedIPs.split(",").map((ip) => ip.trim())
        : null,
      requestsPerMinute: rpm,
      requestsPerHour: rph,
      requestsPerDay: rpd,
      maxLoginAttempts,
      lockoutDuration,
      maxFileSizeMb: maxFileSize,
      uploadsPerHour,
      concurrentUploads,
      progressiveDelays: throttleOptions.progressiveDelays,
      blockSuspiciousIp: throttleOptions.blockSuspiciousIp,
      sendEmailAlerts: throttleOptions.sendEmailAlerts,
      whitelistedIps: throttleOptions.whitelistedIps ? [] : null, // assuming empty array if enabled
    };
    updateSettingsMutation.mutate(data);
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

  const currencyOptions: Option<string>[] = [
    { label: "USD - US Dollar", value: "USD" },
    { label: "EUR - Euro", value: "EUR" },
    { label: "GBP - British Pound", value: "GBP" },
  ];

  const timezoneOptions: Option<string>[] = [
    { label: "UTC", value: "UTC" },
    { label: "UTC+1", value: "UTC+1" },
    { label: "UTC-5", value: "UTC-5" },
  ];

  const languageOptions: Option<string>[] = [
    { label: "English", value: "English" },
    { label: "French", value: "French" },
    { label: "Spanish", value: "Spanish" },
  ];

  const dateFormatOptions: Option<string>[] = [
    { label: "MM/DD/YYYY", value: "MM/DD/YYYY" },
    { label: "DD/MM/YYYY", value: "DD/MM/YYYY" },
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6"
    >
      <form onSubmit={handleSave} className="space-y-8">
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            General Settings
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Configure your application's general preferences.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Site Name
              </label>
              <input
                type="text"
                title="siteName"
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
                title="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Default Currency
              </label>
              <CustomSelect
                options={currencyOptions}
                value={currencyOptions.find((opt) => opt.value === currency)}
                onChange={(selected) =>
                  setCurrency((selected as Option<string>).value)
                }
                placeholder="Select Currency"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Timezone
              </label>
              <CustomSelect
                options={timezoneOptions}
                value={timezoneOptions.find((opt) => opt.value === timezone)}
                onChange={(selected) =>
                  setTimezone((selected as Option<string>).value)
                }
                placeholder="Select Timezone"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Site Description
              </label>
              <textarea
                rows={2}
                title="siteDescription"
                value={siteDesc}
                onChange={(e) => setSiteDesc(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-purple-600 outline-none bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Default Language
              </label>
              <CustomSelect
                options={languageOptions}
                value={languageOptions.find((opt) => opt.value === language)}
                onChange={(selected) =>
                  setLanguage((selected as Option<string>).value)
                }
                placeholder="Select Language"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Format
              </label>
              <CustomSelect
                options={dateFormatOptions}
                value={dateFormatOptions.find(
                  (opt) => opt.value === dateFormat
                )}
                onChange={(selected) =>
                  setDateFormat((selected as Option<string>).value)
                }
                placeholder="Select Date Format"
              />
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Maintenance Mode
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Control when your application goes offline for updates.
          </p>

          <CustomCheckbox
            checked={maintenanceEnabled}
            onChange={setMaintenanceEnabled}
            label="Enable maintenance mode"
            className="mb-4"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="datetime-local"
                title="startDate"
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
                title="endDate"
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
                title="maintenanceMessage"
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
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
        >
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
                title="reqestPerMinute"
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
                title="reqestPerHour"
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
                title="reqestPerDay"
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
                title="newLoginAttempts"
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
                title="lockoutDuration"
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
                title="maxFileSize"
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
                title="uploadPerHour"
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
                title="concurrentUploads"
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
                <CustomCheckbox
                  key={key}
                  checked={throttleOptions[key]}
                  onChange={() => toggleThrottleOption(key)}
                  label={key.replace(/([A-Z])/g, " $1")}
                />
              )
            )}
          </div>
        </motion.section>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-end"
        >
          <button
            type="submit"
            disabled={updateSettingsMutation.isPending}
            className="bg-purple-600 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition disabled:opacity-50"
          >
            {updateSettingsMutation.isPending ? "Saving..." : "Save Changes"}
          </button>
        </motion.div>
      </form>
    </motion.div>
  );
}
