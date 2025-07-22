import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import SettingsProvider from "./contexts/SettingsProvider";
import "./styles/index.css";

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

document.documentElement.setAttribute(
    'data-theme',
    prefersDark ? 'mocha' : 'latte',
);


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SettingsProvider>
      <App />
    </SettingsProvider>
  </StrictMode>
);
