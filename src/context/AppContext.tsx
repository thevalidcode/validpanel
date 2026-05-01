import type {
  AppContextType,
  AppProviderProps,
  CurrencyRates,
} from "../types/AppContext.types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { createContext, useState, useMemo, useEffect } from "react";
import { del, get, set } from "idb-keyval";
import type { CurrencyCode } from "@/lib/currencyConverter";
import type { Admin, User } from "@/types";
import { timezoneToCurrency } from "@/_docs/doc";

// Create the context with a default value of undefined
const AppContext = createContext<AppContextType | undefined>(undefined);

const getDomain = () => {
  const currentUrl = window.location.href.replace(/^https?:\/\//, "");
  let domain = currentUrl.split("/")[0];
  if (domain.startsWith("www.")) {
    domain = domain.slice(4);
  }
  return domain;
};

const AppProvider = ({ children }: AppProviderProps) => {
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [rates, setRates] = useState<CurrencyRates | {}>({});
  const [adminInfo, setAdminInfo] = useState<Admin | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [userCurrency, setUserCurrencyState] = useState<CurrencyCode>("USD");
  const domain = getDomain();
  const getPathname = () => {
    if (typeof window !== "undefined" && window.location && window.location.pathname) {
      return window.location.pathname;
    }
    return "/";
  };

  const pathname = getPathname();
  const activeAuthRole = pathname.startsWith("/admin") ? "admin" : "user";

  const clearBrowserAuthCookies = () => {
    if (typeof document === "undefined") return;

    document.cookie = "auth_token=; Max-Age=0; path=/";
    document.cookie = "csrf_token=; Max-Age=0; path=/";
  };

  const clearStoredAuth = async () => {
    setUserInfo(null);
    setAdminInfo(null);

    try {
      await Promise.all([del("userInfo"), del("adminInfo")]);
    } finally {
      clearBrowserAuthCookies();
    }
  };

  // Load user/admin from IndexedDB on mount
  useEffect(() => {
    const loadUserInfo = async () => {
      setIsAuthLoading(true);
      try {
        const [storedUser, storedAdmin] = await Promise.all([
          get<User | null>("userInfo"),
          get<Admin | null>("adminInfo"),
        ]);

        if (activeAuthRole === "admin") {
          if (storedAdmin) {
            setAdminInfo(JSON.parse(JSON.stringify(storedAdmin)) || null);
          } else {
            setAdminInfo(null);
          }
          setUserInfo(null);
          await del("userInfo");
        } else {
          if (storedUser) {
            setUserInfo(JSON.parse(JSON.stringify(storedUser)) || null);
          } else {
            setUserInfo(null);
          }
          setAdminInfo(null);
          await del("adminInfo");
        }
      } catch (err) {
        console.error("Failed to load auth info from IndexedDB:", err);
      } finally {
        setIsAuthLoading(false);
      }
    };
    loadUserInfo();
  }, [activeAuthRole]);

  // Save user/admin info to IndexedDB whenever they change
  useEffect(() => {
    const saveAuthInfo = async () => {
      try {
        if (activeAuthRole === "admin") {
          if (adminInfo) {
            const safeAdmin = JSON.parse(JSON.stringify(adminInfo));
            await set("adminInfo", safeAdmin);
            await del("userInfo");
          } else {
            await del("adminInfo");
          }
        } else {
          if (userInfo) {
            const safeUser = JSON.parse(JSON.stringify(userInfo));
            await set("userInfo", safeUser);
            await del("adminInfo");
          } else {
            await del("userInfo");
          }
        }
      } catch (err) {
        console.error("Failed to save auth info:", err);
      }
    };
    saveAuthInfo();
  }, [activeAuthRole, userInfo, adminInfo]);

  // Sync currency with localStorage and auto-detect from locale
  useEffect(() => {
    const savedCurrency = localStorage.getItem("userCurrency");
    if (savedCurrency && savedCurrency.trim() !== "") {
      setUserCurrencyState(savedCurrency.toUpperCase() as CurrencyCode);
    } else {
      // Auto-detect currency from user's locale
      const detectedCurrency = detectUserCurrency();
      setUserCurrencyState(detectedCurrency);
      localStorage.setItem("userCurrency", detectedCurrency);
    }
  }, []);

  // Function to detect user's currency from locale
  const detectUserCurrency = (): CurrencyCode => {
    try {
      // Use timezone for more accurate currency detection
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      if (timezoneToCurrency[timeZone]) {
        return timezoneToCurrency[timeZone];
      }

      // Fallback: try to extract region from timezone
      const region = timeZone.split("/")[0];
      if (region === "America") return "USD";
      if (region === "Europe") return "EUR";
      if (region === "Asia") return "USD";
      if (region === "Africa") return "NGN";

      // Final fallback to USD
      return "USD";
    } catch (error) {
      console.error("Failed to detect currency:", error);
      return "USD";
    }
  };

  const setUserCurrency = (currency: string) => {
    const upper = currency.toUpperCase() as CurrencyCode;
    setUserCurrencyState(upper);
    localStorage.setItem("userCurrency", upper);
  };

  const handleSetUserInfo = (user: User | null) => setUserInfo(user);
  const handleSetAdminInfo = (admin: Admin | null) => setAdminInfo(admin);

  // Memoized axios instance
  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: import.meta.env.VITE_API_URL || "/api",
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const status = error?.response?.status;
        const payload = error?.response?.data;
        const combinedMessage = `${payload?.error ?? ""} ${payload?.message ?? ""} ${error?.message ?? ""}`.toLowerCase();

        if (
          status === 401 &&
          !String(error?.config?.url ?? "").includes("/auth/core/logout") &&
          /token|auth|session|missing authentication/.test(combinedMessage)
        ) {
          await instance.post("/auth/core/logout").catch(() => undefined);
          await clearStoredAuth();
          window.location.replace(
            activeAuthRole === "admin" ? "/admin/login" : "/login",
          );
        }

        return Promise.reject(error);
      },
    );

    return instance;
  }, [activeAuthRole]);

  // Fetch currency rates
  const { isLoading: isRatesLoading } = useQuery({
    queryKey: ["rates"],
    queryFn: async () => {
      const res = await api.get("/rates");
      if (!res.data) throw new Error("No rates data found");
      setRates(res.data.rates as CurrencyRates);
      return res.data;
    },
  });

  return (
    <AppContext.Provider
      value={{
        userInfo,
        adminInfo,
        rates,
        isRatesLoading,
        userCurrency,
        isAuthLoading,
        setUserCurrency,
        handleSetUserInfo,
        handleSetAdminInfo,
        domain,
        api,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
