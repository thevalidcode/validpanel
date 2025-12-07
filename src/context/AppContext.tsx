import type {
  AppContextType,
  AppProviderProps,
  CurrencyRates,
} from "../types/AppContext.types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { createContext, useState, useMemo, useEffect } from "react";
import { get, set } from "idb-keyval";
import type { CurrencyCode } from "@/lib/currencyConverter";
import type { Admin, User } from "@/types";

// Create the context with a default value of undefined
const AppContext = createContext<AppContextType | undefined>(undefined);

const AppProvider = ({ children }: AppProviderProps) => {
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [rates, setRates] = useState<CurrencyRates | {}>({});
  const [adminInfo, setAdminInfo] = useState<Admin | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [userCurrency, setUserCurrencyState] = useState<CurrencyCode>("USD");

  // Load user/admin from IndexedDB on mount
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const storedUser = await get<User | null>("userInfo");
        if (storedUser) setUserInfo(storedUser);

        const storedAdmin = await get<Admin | null>("adminInfo");
        if (storedAdmin) setAdminInfo(storedAdmin);
      } catch (err) {
        console.error("Failed to load auth info from IndexedDB:", err);
      } finally {
        setIsAuthLoading(false);
      }
    };
    loadUserInfo();
  }, []);

  // Save user/admin info to IndexedDB whenever they change
  useEffect(() => {
    const saveAuthInfo = async () => {
      try {
        const safeUser = userInfo ? JSON.parse(JSON.stringify(userInfo)) : null;
        const safeAdmin = adminInfo
          ? JSON.parse(JSON.stringify(adminInfo))
          : null;

        await set("userInfo", safeUser);
        await set("adminInfo", safeAdmin);
      } catch (err) {
        console.error("Failed to save auth info:", err);
      }
    };
    saveAuthInfo();
  }, [userInfo, adminInfo]);

  // Sync currency with localStorage
  useEffect(() => {
    const savedCurrency = localStorage.getItem("userCurrency");
    if (savedCurrency)
      setUserCurrencyState(savedCurrency.toUpperCase() as CurrencyCode);
    else localStorage.setItem("userCurrency", "USD");
  }, []);

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
    return instance;
  }, []);

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
        api,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
