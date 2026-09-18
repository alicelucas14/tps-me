import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { useSiteStore } from "./store/siteStore";

// Render immediately from localStorage / default — no blank page
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Fetch server config in the background — updates the store silently when ready
useSiteStore.getState().loadServerConfig();
