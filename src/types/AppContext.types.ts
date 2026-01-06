import type { User, Admin } from "@/types";
import type { CurrencyCode } from "@/lib/currencyConverter";
import type { AxiosInstance } from "axios";

export interface CurrencyRates {
  [key: string]: number;
}

// Type for the AppContext value
export type AppContextType = {
  userInfo: User | null;
  adminInfo: Admin | null;
  rates: CurrencyRates | {};
  userCurrency: CurrencyCode;
  isAuthLoading: boolean;
  isRatesLoading: boolean;
  domain: string;

  setUserCurrency: (currency: string) => void;
  handleSetUserInfo: (user: User | null) => void;
  handleSetAdminInfo: (admin: Admin | null) => void;

  api: AxiosInstance;
};

// Props for the AppProvider component
export interface AppProviderProps {
  children: import("react").ReactNode;
}
