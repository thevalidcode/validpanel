import type { UserType } from "../client/components/Login/auth.type";

// Type for the AppContext value
export type AppContextType = {
  siteTitle: string;
  api: string;
  user?: UserType | undefined | null
}

// Props for the AppProvider component
export interface AppProviderProps {
  children: import("react").ReactNode;
}