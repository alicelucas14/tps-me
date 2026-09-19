import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AdminRole =
  | "Super Admin"
  | "Operations Manager"
  | "Content Editor"
  | "Support Lead";

export type AdminPage =
  | "dashboard"
  | "pages"
  | "posts"
  | "builder"
  | "tournaments"
  | "bonuses"
  | "footer"
  | "settings"
  | "accounts";

export const DEFAULT_ROLE_PERMISSIONS: Record<AdminRole, AdminPage[]> = {
  "Super Admin": [
    "dashboard",
    "pages",
    "posts",
    "builder",
    "tournaments",
    "bonuses",
    "accounts",
    "footer",
    "settings",
  ],
  "Operations Manager": [
    "dashboard",
    "pages",
    "posts",
    "builder",
    "tournaments",
    "bonuses",
    "footer",
  ],
  "Content Editor": ["dashboard", "pages", "posts", "builder"],
  "Support Lead": ["dashboard", "tournaments", "bonuses"],
};

export interface AdminAccount {
  id: string;
  username: string;
  name: string;
  role: AdminRole;
  password: string;
  status: "active" | "suspended";
  createdAt: string;
  lastLogin?: string;
}

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  role: AdminRole;
  lastLogin: string;
}

interface AdminAuthStore {
  isAuthenticated: boolean;
  user: AdminUser | null;
  savedUsername: string;
  rememberMe: boolean;
  accounts: AdminAccount[];
  rolePermissions: Record<AdminRole, AdminPage[]>;
  isSyncing: boolean;
  lastSyncTime: string | null;
  syncError: string | null;

  // Server Synchronization Actions
  loadServerAccounts: () => Promise<{ success: boolean; count?: number; error?: string }>;
  syncAccountsToServer: (
    customAccounts?: AdminAccount[],
    customRoles?: Record<AdminRole, AdminPage[]>
  ) => Promise<{ success: boolean; error?: string }>;

  // Role Permissions Actions
  updateRolePermissions: (role: AdminRole, permissions: AdminPage[]) => void;
  toggleRolePermission: (role: AdminRole, page: AdminPage) => void;
  resetRolePermissionsToDefault: () => void;

  // Account Management Actions
  addAccount: (
    account: Omit<AdminAccount, "id" | "createdAt">
  ) => { success: boolean; error?: string };
  updateAccount: (
    id: string,
    updates: Partial<Omit<AdminAccount, "id" | "createdAt">>
  ) => { success: boolean; error?: string };
  deleteAccount: (id: string) => { success: boolean; error?: string };
  toggleAccountStatus: (id: string) => { success: boolean; error?: string };

  // Auth & Session Actions
  login: (
    username: string,
    password: string,
    remember: boolean
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateCredentials: (
    oldPassword: string,
    newPassword: string,
    newUsername?: string
  ) => { success: boolean; error?: string };
  resetCredentialsToDefault: () => void;
}

const DEFAULT_ACCOUNTS: AdminAccount[] = [
  {
    id: "acc_root_master",
    username: "admin",
    name: "Master Administrator",
    role: "Super Admin",
    password: "admin123",
    status: "active",
    createdAt: "2026-01-01",
  },
];

// Helper to check old storage for migration
function getInitialAccounts(): AdminAccount[] {
  try {
    const rawSec = localStorage.getItem("tps_admin_security_v1");
    if (rawSec) {
      const parsed = JSON.parse(rawSec);
      if (parsed.username && parsed.password) {
        return [
          {
            id: "acc_root_master",
            username: parsed.username,
            name: "Master Administrator",
            role: "Super Admin",
            password: parsed.password,
            status: "active",
            createdAt: "2026-01-01",
          },
        ];
      }
    }
  } catch {}
  return DEFAULT_ACCOUNTS;
}

// Helper to get publish secret for server communication
function getPublishSecret(): string {
  try {
    return localStorage.getItem("tps_publish_secret_v1") || "tps-publish-2025";
  } catch {
    return "tps-publish-2025";
  }
}

export const useAdminAuthStore = create<AdminAuthStore>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      savedUsername: "",
      rememberMe: true,
      accounts: getInitialAccounts(),
      rolePermissions: DEFAULT_ROLE_PERMISSIONS,
      isSyncing: false,
      lastSyncTime: null,
      syncError: null,

      loadServerAccounts: async () => {
        set({ isSyncing: true, syncError: null });
        try {
          const response = await fetch("/api/admin/accounts", { cache: "no-store" });
          if (!response.ok) {
            set({ isSyncing: false });
            return { success: false, error: `HTTP ${response.status}` };
          }
          const data = await response.json();
          if (!data || !Array.isArray(data.accounts)) {
            set({ isSyncing: false });
            return { success: false, error: "Invalid response from server" };
          }

          const serverAccounts: AdminAccount[] = data.accounts;
          const serverRoles = data.rolePermissions || DEFAULT_ROLE_PERMISSIONS;
          const localAccounts = get().accounts;

          // If this device's local storage has custom accounts not yet on the server (e.g. 'Nel'),
          // merge them and push to the server immediately so existing local accounts are preserved!
          const missingOnServer = localAccounts.filter(
            (loc) => !serverAccounts.some((srv) => srv.username.toLowerCase() === loc.username.toLowerCase())
          );

          let finalAccounts = serverAccounts;
          if (missingOnServer.length > 0) {
            finalAccounts = [...serverAccounts, ...missingOnServer];
            get().syncAccountsToServer(finalAccounts, serverRoles);
          }

          const nowStr = new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });

          set({
            accounts: finalAccounts,
            rolePermissions: serverRoles,
            isSyncing: false,
            lastSyncTime: nowStr,
            syncError: null,
          });

          return { success: true, count: finalAccounts.length };
        } catch (err: any) {
          set({ isSyncing: false, syncError: err?.message || "Failed to reach server" });
          return { success: false, error: err?.message || "Offline" };
        }
      },

      syncAccountsToServer: async (customAccounts, customRoles) => {
        set({ isSyncing: true, syncError: null });
        try {
          const accounts = customAccounts || get().accounts;
          const rolePermissions = customRoles || get().rolePermissions;
          const secret = getPublishSecret();

          const response = await fetch("/api/admin/accounts", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-publish-secret": secret,
            },
            body: JSON.stringify({ accounts, rolePermissions }),
          });

          if (!response.ok) {
            const err = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
            const errMsg = err.error || "Failed to save accounts to server";
            set({ isSyncing: false, syncError: errMsg });
            return { success: false, error: errMsg };
          }

          const nowStr = new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });

          set({ isSyncing: false, lastSyncTime: nowStr, syncError: null });
          return { success: true };
        } catch (err: any) {
          set({ isSyncing: false, syncError: err?.message || "Network error" });
          return { success: false, error: err?.message || "Network error" };
        }
      },

      updateRolePermissions: (role, permissions) => {
        set((state) => ({
          rolePermissions: {
            ...DEFAULT_ROLE_PERMISSIONS,
            ...state.rolePermissions,
            [role]: permissions,
          },
        }));
        get().syncAccountsToServer();
      },

      toggleRolePermission: (role, page) => {
        set((state) => {
          const currentRoleMap = { ...DEFAULT_ROLE_PERMISSIONS, ...state.rolePermissions };
          const currentPages = currentRoleMap[role] || [];
          const updatedPages = currentPages.includes(page)
            ? currentPages.filter((p) => p !== page)
            : [...currentPages, page];
          return {
            rolePermissions: {
              ...currentRoleMap,
              [role]: updatedPages,
            },
          };
        });
        get().syncAccountsToServer();
      },

      resetRolePermissionsToDefault: () => {
        set({
          rolePermissions: DEFAULT_ROLE_PERMISSIONS,
        });
        get().syncAccountsToServer();
      },

      addAccount: (accountData) => {
        const cleanUsername = accountData.username.trim();
        const cleanPassword = accountData.password.trim();
        const cleanName = accountData.name.trim();

        if (!cleanUsername || cleanUsername.length < 3) {
          return { success: false, error: "Username must be at least 3 characters." };
        }

        if (!/^[a-zA-Z0-9._-]+$/.test(cleanUsername)) {
          return { success: false, error: "Username can only contain letters, numbers, hyphens, and underscores." };
        }

        if (!cleanPassword || cleanPassword.length < 6) {
          return { success: false, error: "Password must be at least 6 characters long." };
        }

        const existing = get().accounts.find(
          (a) => a.username.toLowerCase() === cleanUsername.toLowerCase()
        );

        if (existing) {
          return { success: false, error: `Account with username '@${cleanUsername}' already exists.` };
        }

        const newAccount: AdminAccount = {
          id: `acc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          username: cleanUsername,
          name: cleanName || cleanUsername,
          role: accountData.role || "Operations Manager",
          password: cleanPassword,
          status: accountData.status || "active",
          createdAt: new Date().toISOString().split("T")[0],
        };

        set((state) => ({
          accounts: [...state.accounts, newAccount],
        }));
        get().syncAccountsToServer();

        return { success: true };
      },

      updateAccount: (id, updates) => {
        const accounts = get().accounts;
        const target = accounts.find((a) => a.id === id);

        if (!target) {
          return { success: false, error: "Account not found." };
        }

        if (updates.username) {
          const cleanUser = updates.username.trim();
          if (cleanUser.length < 3) {
            return { success: false, error: "Username must be at least 3 characters." };
          }
          const duplicate = accounts.find(
            (a) => a.id !== id && a.username.toLowerCase() === cleanUser.toLowerCase()
          );
          if (duplicate) {
            return { success: false, error: `Username '@${cleanUser}' is already taken.` };
          }
        }

        if (updates.password && updates.password.trim().length < 6) {
          return { success: false, error: "Password must be at least 6 characters long." };
        }

        // Prevent downgrading the last active Super Admin
        if (
          updates.role &&
          updates.role !== "Super Admin" &&
          target.role === "Super Admin"
        ) {
          const superAdmins = accounts.filter(
            (a) => a.role === "Super Admin" && a.status === "active"
          );
          if (superAdmins.length <= 1) {
            return {
              success: false,
              error: "Cannot change role: There must be at least one active Super Admin.",
            };
          }
        }

        set((state) => ({
          accounts: state.accounts.map((a) => {
            if (a.id !== id) return a;
            return {
              ...a,
              ...updates,
              username: updates.username ? updates.username.trim() : a.username,
              name: updates.name ? updates.name.trim() : a.name,
              password: updates.password ? updates.password.trim() : a.password,
            };
          }),
        }));

        // If the current logged-in user was updated, keep active user synchronized
        const currentUser = get().user;
        if (currentUser && currentUser.id === id) {
          set({
            user: {
              ...currentUser,
              username: updates.username ? updates.username.trim() : currentUser.username,
              name: updates.name ? updates.name.trim() : currentUser.name,
              role: updates.role ? updates.role : currentUser.role,
            },
          });
        }

        get().syncAccountsToServer();
        return { success: true };
      },

      deleteAccount: (id) => {
        const accounts = get().accounts;
        const target = accounts.find((a) => a.id === id);

        if (!target) {
          return { success: false, error: "Account not found." };
        }

        // Prevent deleting currently logged-in account
        const currentUser = get().user;
        if (currentUser && currentUser.id === id) {
          return { success: false, error: "You cannot delete the account you are currently logged into." };
        }

        // Prevent deleting the last Super Admin
        if (target.role === "Super Admin") {
          const superAdmins = accounts.filter((a) => a.role === "Super Admin");
          if (superAdmins.length <= 1) {
            return {
              success: false,
              error: "Cannot delete the only remaining Super Admin account.",
            };
          }
        }

        set((state) => ({
          accounts: state.accounts.filter((a) => a.id !== id),
        }));

        get().syncAccountsToServer();
        return { success: true };
      },

      toggleAccountStatus: (id) => {
        const accounts = get().accounts;
        const target = accounts.find((a) => a.id === id);

        if (!target) {
          return { success: false, error: "Account not found." };
        }

        const currentUser = get().user;
        if (currentUser && currentUser.id === id) {
          return { success: false, error: "You cannot suspend your own active account." };
        }

        // Prevent suspending the last Super Admin
        if (target.role === "Super Admin" && target.status === "active") {
          const activeSuperAdmins = accounts.filter(
            (a) => a.role === "Super Admin" && a.status === "active"
          );
          if (activeSuperAdmins.length <= 1) {
            return {
              success: false,
              error: "Cannot suspend: There must be at least one active Super Admin.",
            };
          }
        }

        const newStatus = target.status === "active" ? "suspended" : "active";

        set((state) => ({
          accounts: state.accounts.map((a) =>
            a.id === id ? { ...a, status: newStatus } : a
          ),
        }));

        get().syncAccountsToServer();
        return { success: true };
      },

      login: async (username: string, password: string, remember: boolean) => {
        const cleanUser = username.trim().toLowerCase();
        const cleanPass = password.trim();

        // 1. Attempt server-side login first
        try {
          const res = await fetch("/api/admin/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: cleanUser, password: cleanPass }),
          });

          if (res.ok) {
            const data = await res.json();
            if (data.success && data.user) {
              set({
                isAuthenticated: true,
                user: data.user,
                accounts: Array.isArray(data.accounts) ? data.accounts : get().accounts,
                rolePermissions: data.rolePermissions || get().rolePermissions,
                savedUsername: remember ? data.user.username : "",
                rememberMe: remember,
              });

              if (!remember) {
                sessionStorage.setItem("tps_admin_session_active", "true");
              }
              return { success: true };
            }
          } else {
            const errData = await res.json().catch(() => null);
            if (errData && errData.error) {
              return { success: false, error: errData.error };
            }
          }
        } catch (networkErr) {
          console.warn("[adminAuthStore] Server unreachable during login, checking local cache:", networkErr);
        }

        // 2. Fallback to local accounts verification (offline resilience)
        const account = get().accounts.find(
          (a) => a.username.toLowerCase() === cleanUser
        );

        if (!account) {
          return { success: false, error: "Invalid username. Please check your credentials." };
        }

        if (account.status === "suspended") {
          return {
            success: false,
            error: "This administrator account has been suspended. Please contact a Super Admin.",
          };
        }

        if (cleanPass !== account.password) {
          return { success: false, error: "Incorrect password. Access denied." };
        }

        const nowStr = new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          day: "numeric",
          month: "short",
        });

        // Update account's lastLogin
        set((state) => ({
          accounts: state.accounts.map((a) =>
            a.id === account.id ? { ...a, lastLogin: nowStr } : a
          ),
          isAuthenticated: true,
          user: {
            id: account.id,
            username: account.username,
            name: account.name,
            role: account.role,
            lastLogin: nowStr,
          },
          savedUsername: remember ? account.username : "",
          rememberMe: remember,
        }));

        // Store session flag if remember is false
        if (!remember) {
          sessionStorage.setItem("tps_admin_session_active", "true");
        }

        // Try to sync lastLogin back to server
        get().syncAccountsToServer();

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
        const currentUser = get().user;
        if (!currentUser) {
          return { success: false, error: "No active session." };
        }

        const accounts = get().accounts;
        const currentAccount = accounts.find((a) => a.id === currentUser.id);

        if (!currentAccount) {
          return { success: false, error: "Account not found." };
        }

        if (oldPassword.trim() !== currentAccount.password) {
          return { success: false, error: "Current password does not match." };
        }

        if (newPassword.trim().length < 6) {
          return { success: false, error: "New password must be at least 6 characters long." };
        }

        return get().updateAccount(currentAccount.id, {
          username: newUsername?.trim() || currentAccount.username,
          password: newPassword.trim(),
        });
      },

      resetCredentialsToDefault: () => {
        set({
          accounts: DEFAULT_ACCOUNTS,
        });
        get().syncAccountsToServer();
      },
    }),
    {
      name: "tps_admin_auth_v2",
      partialize: (state) => {
        return {
          accounts: state.accounts,
          rolePermissions: state.rolePermissions || DEFAULT_ROLE_PERMISSIONS,
          isAuthenticated: state.rememberMe ? state.isAuthenticated : false,
          user: state.rememberMe ? state.user : null,
          savedUsername: state.rememberMe ? state.savedUsername : "",
          rememberMe: state.rememberMe,
          lastSyncTime: state.lastSyncTime,
        };
      },
    }
  )
);
