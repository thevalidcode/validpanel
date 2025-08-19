import { createContext} from "react";
import type { AppContextType, AppProviderProps } from "../types/AppContext.types";

// Create the context with a default value of undefined
const AppContext = createContext<AppContextType | undefined>(undefined);

const AppProvider = ({ children }: AppProviderProps) => {
  const env = process.env.NODE_ENV;

  const backendUrl =
    env === "production"
      ? "https://validpanel.com:3002"
      : "http://localhost:3002";

  const siteTitle = "Valid Panel";

  return (
    <AppContext.Provider
      value={{
        siteTitle,
        backendUrl,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };