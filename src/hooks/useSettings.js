import { useContext } from "react";
import { SettingsContext } from "../contexts/settingsContext";

// Custom hook to access settings context
export const useSettings = () => {
  return useContext(SettingsContext);
};
