import { useContext } from "react";
import type { AppContextType } from "../types/AppContext.types";
import { AppContext } from "./AppContext";

// Custom hook to access the context
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};