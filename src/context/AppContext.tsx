import { createContext} from "react";
import type { AppContextType, AppProviderProps } from "../types/AppContext.types";
import { getStorageValue } from "../hooks/useLocalStorage";
import {type UserType } from "../client/components/Login/auth.type";

// Create the context with a default value of undefined
const AppContext = createContext<AppContextType | undefined>(undefined);

const AppProvider = ({ children }: AppProviderProps) => {

  const api = "/api";

  const siteTitle = "Valid Panel";

  const user = getStorageValue<UserType | undefined | null>('user', 'session');

  return (
    <AppContext.Provider
      value={{
        siteTitle,
        api,
        user
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };