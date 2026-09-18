import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { useSiteStore } from "./store/siteStore";

// Load server-published config before first render so all visitors
// see the same content the admin published, not stale localStorage.
useSiteStore.getState().loadServerConfig().finally(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
