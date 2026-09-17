import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AdminUser {
  username: string;
  name: string;
  role: string;
  lastLogin: string;
}

interface AdminAuthStore {
  isAuthenticated: boolean;
  user: AdminUser | null;
  savedUsername: string;
  rememberMe: boolean;

  // Login & Session actions
  login: (username: string, password: string, remember: boolean) => { success: boolean; error?: string };
  logout: () => void;
  updateCredentials: (
    oldPassword: string,
    newPassword: string,
    newUsername?: string
  ) => { success: boolean; error?: string };
  resetCredentialsToDefault: () => void;
}

const DEFAULT_USERNAME = "admin";
const DEFAULT_PASSWORD = "admin123";
const CREDENTIALS_KEY = "tps_admin_security_v1";

interface StoredSecurity {
  username: string;
  password: string;
}

function getStoredSecurity(): StoredSecurity {
  try {
    const raw = localStorage.getItem(CREDENTIALKeySafe());
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.username && parsed.password) {
        return parsed;
      }
    }
  } catch {}
  return { username: DEFAULT_USERNAME, password: DEFAULT_PASSWORD };
}

function CREDENTIALKeySafe() {
  return CREDENTIALS_KEY;
}

function setStoredSecurity(sec: StoredSecurity) {
  localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(sec));
}

export const useAdminAuthStore = create<AdminAuthStore>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      savedUsername: "admin",
      rememberMe: true,

      login: (username: string, password: string, remember: boolean) => {
        const cleanUser = username.trim();
        const cleanPass = password.trim();

        const currentSec = getStoredSecurity();

        if (cleanUser.toLowerCase() !== currentSec.username.toLowerCase()) {
          return { success: false, error: "Invalid username. Please check your credentials." };
        }

        if (cleanPass !== currentSec.password) {
          return { success: false, error: "Incorrect password. Access denied." };
        }

        const nowStr = new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          day: "numeric",
          month: "short",
        });

        const activeUser: AdminUser = {
          username: currentSec.username,
          name: "Super Administrator",
          role: "Owner / Operations Lead",
          lastLogin: nowStr,
        };

        set({
          isAuthenticated: true,
          user: activeUser,
          savedUsername: remember ? currentSec.username : "",
          rememberMe: remember,
        });

        // Store session flag if remember is false
        if (!remember) {
          sessionStorage.setItem("tps_admin_session_active", "true");
        }

        return { success: true };
      },

      logout: () => {
        sessionStorage.removeItem("tps_admin_session_active");
        set((prev) => ({
          isAuthenticated: false,
          user: null,
          savedUsername: prev.rememberMe ? prev.savedUsername : "",
        }));
      },

      updateCredentials: (oldPassword: string, newPassword: string, newUsername?: string) => {
        const currentSec = getStoredSecurity();

        if (oldPassword.trim() !== currentSec.password) {
          return { success: false, error: "Current password does not match." };
        }

        if (newPassword.trim().length < 6) {
          return { success: false, error: "New password must be at least 6 characters long." };
        }

        const updated: StoredSecurity = {
          username: newUsername?.trim() || currentSec.username,
          password: newPassword.trim(),
        };

        setStoredSecurity(updated);

        const currentUser = get().user;
        if (currentUser) {
          set({
            user: {
              ...currentUser,
              username: updated.username,
            },
            savedUsername: updated.username,
          });
        }

        return { success: true };
      },

      resetCredentialsToDefault: () => {
        setStoredSecurity({
          username: DEFAULT_USERNAME,
          password: DEFAULT_PASSWORD,
        });
      },
    }),
    {
      name: "tps_admin_auth_v1",
      partialize: (state) => {
        if (state.rememberMe) {
          return {
            isAuthenticated: state.isAuthenticated,
            user: state.user,
            savedUsername: state.savedUsername,
            rememberMe: state.rememberMe,
          };
        }
        return {
          savedUsername: state.savedUsername,
          rememberMe: false,
        };
      },
    }
  )
);
