// Type for the AppContext value
export interface AppContextType {
  siteTitle: string;
  backendUrl: string;
}

// Props for the AppProvider component
export interface AppProviderProps {
  children: import("react").ReactNode;
}