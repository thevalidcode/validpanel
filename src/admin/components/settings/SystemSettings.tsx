import React, {
  useState,
  useEffect,
  useRef,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { motion } from "framer-motion";
import CustomSelect, { type Option } from "@/components/ui/CustomSelect";
import CustomCheckbox from "@/components/ui/CustomCheckbox";
import { useGetSettings, useUpdateSettings } from "@/hooks/use-setting";
import Loader from "@/components/Loader";
import ImageUploadBox from "@/components/ImageUploadBox";
import { ImageIcon } from "lucide-react";
import { currency as currencyMap, getCurrencySymbol } from "@/_docs/doc";
interface ThrottleOptions {
  progressiveDelays: boolean;
  blockSuspiciousIp: boolean;
  sendEmailAlerts: boolean;
}

export default function AdminSettings() {
  const { data: settingsData, isLoading } = useGetSettings();
  const updateSettingsMutation = useUpdateSettings();

  const [siteName, setSiteName] = useState<string>("");
  const [adminEmail, setAdminEmail] = useState<string>("");
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [faviconUrl, setFaviconUrl] = useState<string>("");
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

  // Security settings
  const [sessionTimeout, setSessionTimeout] = useState<string>("30");
  const [passwordMinLength, setPasswordMinLength] = useState<number>(8);
  const [whitelistedIps, setWhitelistedIps] = useState<string>("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState<boolean>(false);
  const [passwordHistoryEnabled, setPasswordHistoryEnabled] =
    useState<boolean>(false);
  const [ipWhitelistEnabled, setIpWhitelistEnabled] = useState<boolean>(false);

  const [maxFileSize, setMaxFileSize] = useState<number>(10);
  const [uploadsPerHour, setUploadsPerHour] = useState<number>(20);
  const [concurrentUploads, setConcurrentUploads] = useState<number>(3);

  const [throttleOptions, setThrottleOptions] = useState<ThrottleOptions>({
    progressiveDelays: true,
    blockSuspiciousIp: false,
    sendEmailAlerts: true,
  });

  // Refs for validation
  const currencyRef = useRef<any>(null);
  const timezoneRef = useRef<any>(null);
  const languageRef = useRef<any>(null);
  const dateFormatRef = useRef<any>(null);

  useEffect(() => {
    if (settingsData) {
      setSiteName(settingsData.siteName || "");
      setAdminEmail(settingsData.adminEmail || "");
      setLogoUrl(settingsData.logoUrl || "");
      setFaviconUrl(settingsData.faviconUrl || "");
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
      });

      setWhitelistedIps(
        settingsData.whitelistedIps
          ? settingsData.whitelistedIps.join(", ")
          : ""
      );

      setSessionTimeout(settingsData.sessionTimeout?.toString() || "30");
      setPasswordMinLength(settingsData.passwordMinLength || 8);
      setTwoFactorEnabled(settingsData.twoFactorEnabled || false);
      setPasswordHistoryEnabled(settingsData.passwordHistoryEnabled || false);
      setIpWhitelistEnabled(settingsData.ipWhitelistEnabled || false);
    }
  }, [settingsData]);

  const handleSave = async (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault();

    // Validate required fields
    const isCurrencyValid = currencyRef.current?.validate();
    const isTimezoneValid = timezoneRef.current?.validate();
    const isLanguageValid = languageRef.current?.validate();
    const isDateFormatValid = dateFormatRef.current?.validate();

    if (
      !isCurrencyValid ||
      !isTimezoneValid ||
      !isLanguageValid ||
      !isDateFormatValid
    ) {
      return;
    }

    const data = {
      siteName,
      adminEmail,
      logoUrl,
      faviconUrl,
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
        : [],
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
      whitelistedIps: whitelistedIps
        ? whitelistedIps.split(",").map((ip) => ip.trim())
        : [],
      sessionTimeout: Number(sessionTimeout),
      passwordMinLength,
      twoFactorEnabled,
      passwordHistoryEnabled,
      ipWhitelistEnabled,
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

  const currencyOptions: Option<string>[] = Object.keys(currencyMap).map(
    (code) => ({
      label: `${code} (${getCurrencySymbol(code)})`,
      value: code,
    })
  );

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
    return <Loader />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full p-6 space-y-8"
    >
      <form onSubmit={handleSave} className="space-y-8">
        {/* General Settings */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-y"
        >
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-xl font-semibold text-gray-900">
              General Settings
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Configure your application's general preferences.
            </p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Site Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-purple-600 focus:border-purple-600 outline-none transition"
                  placeholder="Enter site name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Email
                </label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-purple-600 focus:border-purple-600 outline-none transition"
                  placeholder="admin@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Currency <span className="text-red-500">*</span>
                </label>
                <CustomSelect
                  ref={currencyRef}
                  options={currencyOptions}
                  value={currencyOptions.find((opt) => opt.value === currency)}
                  onChange={(selected) =>
                    setCurrency((selected as Option<string>).value)
                  }
                  placeholder="Select Currency"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timezone <span className="text-red-500">*</span>
                </label>
                <CustomSelect
                  ref={timezoneRef}
                  options={timezoneOptions}
                  value={timezoneOptions.find((opt) => opt.value === timezone)}
                  onChange={(selected) =>
                    setTimezone((selected as Option<string>).value)
                  }
                  placeholder="Select Timezone"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Site Description
                </label>
                <textarea
                  rows={3}
                  value={siteDesc}
                  onChange={(e) => setSiteDesc(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-purple-600 focus:border-purple-600 outline-none transition resize-none"
                  placeholder="Describe your application..."
                />
              </div>
            </div>

            {/* Branding Section */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-base font-semibold text-gray-900 mb-4">
                Branding Assets
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ImageUploadBox
                  label="Site Logo"
                  labelIcon={<ImageIcon className="w-4 h-4" />}
                  collection="admins"
                  onUploaded={(url) => setLogoUrl(url)}
                  variant="box"
                  description="Upload your site logo (PNG, JPG up to 5MB)"
                />

                <ImageUploadBox
                  label="Favicon"
                  labelIcon={<ImageIcon className="w-4 h-4" />}
                  collection="admins"
                  onUploaded={(url) => setFaviconUrl(url)}
                  variant="box"
                  description="Upload your favicon (PNG, ICO up to 2MB)"
                  maxSizeMB={2}
                />
              </div>

              {/* Preview Section */}
              {(logoUrl || faviconUrl) && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Preview
                  </p>
                  <div className="flex gap-6 items-start">
                    {logoUrl && (
                      <div className="flex flex-col gap-2">
                        <span className="text-xs text-gray-500">Logo</span>
                        <img
                          src={logoUrl}
                          alt="Site Logo"
                          className="h-12 object-contain bg-white p-2 border border-gray-200 rounded"
                        />
                      </div>
                    )}
                    {faviconUrl && (
                      <div className="flex flex-col gap-2">
                        <span className="text-xs text-gray-500">Favicon</span>
                        <img
                          src={faviconUrl}
                          alt="Favicon"
                          className="h-8 w-8 object-contain bg-white p-1 border border-gray-200 rounded"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Language & Format Settings */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-base font-semibold text-gray-900 mb-4">
                Localization
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Language <span className="text-red-500">*</span>
                  </label>
                  <CustomSelect
                    ref={languageRef}
                    options={languageOptions}
                    value={languageOptions.find(
                      (opt) => opt.value === language
                    )}
                    onChange={(selected) =>
                      setLanguage((selected as Option<string>).value)
                    }
                    placeholder="Select Language"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Format <span className="text-red-500">*</span>
                  </label>
                  <CustomSelect
                    ref={dateFormatRef}
                    options={dateFormatOptions}
                    value={dateFormatOptions.find(
                      (opt) => opt.value === dateFormat
                    )}
                    onChange={(selected) =>
                      setDateFormat((selected as Option<string>).value)
                    }
                    placeholder="Select Date Format"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Maintenance Mode */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-xl font-semibold text-gray-900">
              Maintenance Mode
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Control when your application goes offline for updates.
            </p>
          </div>
          <div className="p-6">
            <CustomCheckbox
              checked={maintenanceEnabled}
              onChange={setMaintenanceEnabled}
              label="Enable maintenance mode"
              required={false}
              className="mb-6"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="datetime-local"
                  title="start-date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-purple-600 focus:border-purple-600 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="datetime-local"
                  value={endDate}
                  title="end-date"
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-purple-600 focus:border-purple-600 outline-none transition"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maintenance Message
                </label>
                <textarea
                  rows={3}
                  value={maintenanceMsg}
                  onChange={(e) => setMaintenanceMsg(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-purple-600 focus:border-purple-600 outline-none transition resize-none"
                  placeholder="Enter maintenance message..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Allowed IPs
                </label>
                <input
                  value={allowedIPs}
                  onChange={(e) => setAllowedIPs(e.target.value)}
                  placeholder="e.g., 192.168.1.1, 127.0.0.1"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-purple-600 focus:border-purple-600 outline-none transition"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Security Settings */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-xl font-semibold text-gray-900">
              Security Settings
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Configure security policies and access controls.
            </p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Timeout (minutes) *
                </label>
                <input
                  type="number"
                  title="session-timeout"
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-purple-600 focus:border-purple-600 outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Login Attempts *
                </label>
                <input
                  type="number"
                  title="max-attempt"
                  value={maxLoginAttempts}
                  onChange={(e) => handleNumberChange(setMaxLoginAttempts, e)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-purple-600 focus:border-purple-600 outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password Min Length *
                </label>
                <input
                  type="number"
                  value={passwordMinLength}
                  title="password-min"
                  onChange={(e) => handleNumberChange(setPasswordMinLength, e)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-purple-600 focus:border-purple-600 outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lockout Duration (minutes) *
                </label>
                <input
                  type="number"
                  title="lockout-duration"
                  value={lockoutDuration}
                  onChange={(e) => handleNumberChange(setLockoutDuration, e)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-purple-600 focus:border-purple-600 outline-none transition"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Whitelisted IPs
                </label>
                <input
                  value={whitelistedIps}
                  onChange={(e) => setWhitelistedIps(e.target.value)}
                  placeholder="e.g., 192.168.1.1, 127.0.0.1"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-purple-600 focus:border-purple-600 outline-none transition"
                />
              </div>
            </div>

            <div className="mt-6 space-y-4 flex flex-col">
              <CustomCheckbox
                checked={twoFactorEnabled}
                onChange={setTwoFactorEnabled}
                label="Enable two-factor authentication"
              />

              <CustomCheckbox
                checked={passwordHistoryEnabled}
                onChange={setPasswordHistoryEnabled}
                label="Enable password history check"
              />

              <CustomCheckbox
                checked={ipWhitelistEnabled}
                onChange={setIpWhitelistEnabled}
                label="Enable IP whitelisting"
              />
            </div>
          </div>
        </motion.div>

        {/* Rate Limits & Throttling */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-xl font-semibold text-gray-900">
              Rate Limits & Throttling
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Manage API and user activity rate limits.
            </p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requests per Minute
                </label>
                <input
                  type="number"
                  title="requests-per-minute"
                  value={rpm}
                  onChange={(e) => handleNumberChange(setRpm, e)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-purple-600 focus:border-purple-600 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requests per Hour
                </label>
                <input
                  type="number"
                  value={rph}
                  title="requests-per-hour"
                  onChange={(e) => handleNumberChange(setRph, e)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-purple-600 focus:border-purple-600 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requests per Day
                </label>
                <input
                  type="number"
                  title="requests-per-day"
                  value={rpd}
                  onChange={(e) => handleNumberChange(setRpd, e)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-purple-600 focus:border-purple-600 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max File Size (MB)
                </label>
                <input
                  type="number"
                  title="max-file-size"
                  value={maxFileSize}
                  onChange={(e) => handleNumberChange(setMaxFileSize, e)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-purple-600 focus:border-purple-600 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Uploads per Hour
                </label>
                <input
                  type="number"
                  title="uploads-per-hour"
                  value={uploadsPerHour}
                  onChange={(e) => handleNumberChange(setUploadsPerHour, e)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-purple-600 focus:border-purple-600 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Concurrent Uploads
                </label>
                <input
                  type="number"
                  title="concurrent-uploads"
                  value={concurrentUploads}
                  onChange={(e) => handleNumberChange(setConcurrentUploads, e)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-purple-600 focus:border-purple-600 outline-none transition"
                />
              </div>
            </div>

            {/* Throttle Options */}
            <div className="mt-6 space-y-4 flex flex-col">
              {(
                Object.keys(throttleOptions) as Array<keyof ThrottleOptions>
              ).map((key) => (
                <CustomCheckbox
                  key={key}
                  checked={throttleOptions[key]}
                  onChange={() => toggleThrottleOption(key)}
                  label={key.replace(/([A-Z])/g, " $1")}
                />
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-end pt-6"
        >
          <button
            type="submit"
            disabled={updateSettingsMutation.isPending}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-purple-700 focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updateSettingsMutation.isPending ? "Saving..." : "Save Changes"}
          </button>
        </motion.div>
      </form>
    </motion.div>
  );
}
