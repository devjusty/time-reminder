import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import SettingsProvider from "./contexts/SettingsContext";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SettingsProvider>
      <App />
    </SettingsProvider>
  </StrictMode>
);
