import { useContext } from "react";
import { SettingsContext } from "../contexts/settingsContext";

export const useSettings = () => {
  return useContext(SettingsContext);
};
