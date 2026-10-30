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

// Must match MIN_PASSWORD_LENGTH in server.js
export const MIN_PASSWORD_LENGTH = 8;

export interface AdminAccount {
  id: string;
  username: string;
  name: string;
  role: AdminRole;
  status: "active" | "suspended";
  createdAt: string;
  lastLogin?: string;
  /** Only sent to the server when setting a new password; the server never returns passwords. */
  password?: string;
}

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  role: AdminRole;
  lastLogin: string;
}

type ActionResult = { success: boolean; error?: string };

interface SessionPayload {
  user: AdminUser;
  rolePermissions?: Record<AdminRole, AdminPage[]>;
  accounts?: AdminAccount[];
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
  ) => Promise<ActionResult>;

  // Role Permissions Actions
  updateRolePermissions: (role: AdminRole, permissions: AdminPage[]) => Promise<ActionResult>;
  toggleRolePermission: (role: AdminRole, page: AdminPage) => Promise<ActionResult>;
  resetRolePermissionsToDefault: () => Promise<ActionResult>;

  // Account Management Actions
  addAccount: (account: Omit<AdminAccount, "id" | "createdAt">) => Promise<ActionResult>;
  updateAccount: (
    id: string,
    updates: Partial<Omit<AdminAccount, "id" | "createdAt">>
  ) => Promise<ActionResult>;
  deleteAccount: (id: string) => Promise<ActionResult>;
  toggleAccountStatus: (id: string) => Promise<ActionResult>;

  // Auth & Session Actions
  login: (username: string, password: string, remember: boolean) => Promise<ActionResult>;
  verifySession: () => Promise<boolean>;
  logout: () => void;
  updateCredentials: (
    oldPassword: string,
    newPassword: string,
    newUsername?: string
  ) => Promise<ActionResult>;
}

// Older versions kept plaintext passwords and the publish secret in localStorage
try {
  ["tps_admin_auth_v2", "tps_admin_security_v1", "tps_publish_secret_v1"].forEach((key) =>
    localStorage.removeItem(key)
  );
} catch {}

function nowTimeString() {
  return new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

async function readError(response: Response, fallback: string) {
  const data = await response.json().catch(() => null);
  return (data && data.error) || `${fallback} (HTTP ${response.status})`;
}

const SIGNED_OUT = { isAuthenticated: false, user: null, accounts: [] as AdminAccount[] };

export const useAdminAuthStore = create<AdminAuthStore>()(
  persist(
    (set, get) => {
      const applySession = (data: SessionPayload) => {
        set({
          isAuthenticated: true,
          user: data.user,
          rolePermissions: data.rolePermissions || get().rolePermissions,
          accounts: Array.isArray(data.accounts) ? data.accounts : [],
        });
      };

      // Any 401 means the server no longer recognizes this session
      const handleUnauthorized = (response: Response) => {
        if (response.status === 401) set(SIGNED_OUT);
      };

      return {
        isAuthenticated: false,
        user: null,
        savedUsername: "",
        rememberMe: true,
        accounts: [],
        rolePermissions: DEFAULT_ROLE_PERMISSIONS,
        isSyncing: false,
        lastSyncTime: null,
        syncError: null,

        loadServerAccounts: async () => {
          set({ isSyncing: true, syncError: null });
          try {
            const response = await fetch("/api/admin/accounts", { cache: "no-store" });
            if (!response.ok) {
              handleUnauthorized(response);
              const error = await readError(response, "Could not load accounts");
              set({ isSyncing: false, syncError: error });
              return { success: false, error };
            }
            const data = await response.json();
            if (!data || !Array.isArray(data.accounts)) {
              set({ isSyncing: false });
              return { success: false, error: "Invalid response from server" };
            }

            set({
              accounts: data.accounts,
              rolePermissions: data.rolePermissions || DEFAULT_ROLE_PERMISSIONS,
              isSyncing: false,
              lastSyncTime: nowTimeString(),
              syncError: null,
            });
            return { success: true, count: data.accounts.length };
          } catch (err: any) {
            set({ isSyncing: false, syncError: err?.message || "Failed to reach server" });
            return { success: false, error: err?.message || "Offline" };
          }
        },

        // The server is the source of truth: local state only changes once it accepts the update
        syncAccountsToServer: async (customAccounts, customRoles) => {
          set({ isSyncing: true, syncError: null });
          try {
            const response = await fetch("/api/admin/accounts", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                accounts: customAccounts || get().accounts,
                rolePermissions: customRoles || get().rolePermissions,
              }),
            });

            if (!response.ok) {
              handleUnauthorized(response);
              const error = await readError(response, "Failed to save accounts to server");
              set({ isSyncing: false, syncError: error });
              return { success: false, error };
            }

            const data = await response.json();
            set({
              accounts: data.accounts,
              rolePermissions: data.rolePermissions,
              isSyncing: false,
              lastSyncTime: nowTimeString(),
              syncError: null,
            });

            // Keep the signed-in user's own details in step with the saved list
            const currentUser = get().user;
            const me = (data.accounts as AdminAccount[]).find((a) => a.id === currentUser?.id);
            if (currentUser && me) {
              set({ user: { ...currentUser, username: me.username, name: me.name, role: me.role } });
            }
            return { success: true };
          } catch (err: any) {
            set({ isSyncing: false, syncError: err?.message || "Network error" });
            return { success: false, error: err?.message || "Network error" };
          }
        },

        updateRolePermissions: (role, permissions) => {
          const roles = { ...DEFAULT_ROLE_PERMISSIONS, ...get().rolePermissions, [role]: permissions };
          return get().syncAccountsToServer(undefined, roles);
        },

        toggleRolePermission: (role, page) => {
          const currentRoleMap = { ...DEFAULT_ROLE_PERMISSIONS, ...get().rolePermissions };
          const currentPages = currentRoleMap[role] || [];
          const updatedPages = currentPages.includes(page)
            ? currentPages.filter((p) => p !== page)
            : [...currentPages, page];
          return get().syncAccountsToServer(undefined, { ...currentRoleMap, [role]: updatedPages });
        },

        resetRolePermissionsToDefault: () => {
          return get().syncAccountsToServer(undefined, DEFAULT_ROLE_PERMISSIONS);
        },

        addAccount: async (accountData) => {
          const cleanUsername = accountData.username.trim();
          const cleanPassword = (accountData.password || "").trim();
          const cleanName = accountData.name.trim();

          if (!cleanUsername || cleanUsername.length < 3) {
            return { success: false, error: "Username must be at least 3 characters." };
          }

          if (!/^[a-zA-Z0-9._-]+$/.test(cleanUsername)) {
            return { success: false, error: "Username can only contain letters, numbers, dots, hyphens, and underscores." };
          }

          if (cleanPassword.length < MIN_PASSWORD_LENGTH) {
            return { success: false, error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.` };
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

          return get().syncAccountsToServer([...get().accounts, newAccount]);
        },

        updateAccount: async (id, updates) => {
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

          if (updates.password && updates.password.trim().length < MIN_PASSWORD_LENGTH) {
            return { success: false, error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.` };
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

          const nextAccounts = accounts.map((a) => {
            if (a.id !== id) return a;
            return {
              ...a,
              ...updates,
              username: updates.username ? updates.username.trim() : a.username,
              name: updates.name ? updates.name.trim() : a.name,
              password: updates.password ? updates.password.trim() : undefined,
            };
          });

          return get().syncAccountsToServer(nextAccounts);
        },

        deleteAccount: async (id) => {
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

          return get().syncAccountsToServer(accounts.filter((a) => a.id !== id));
        },

        toggleAccountStatus: async (id) => {
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

          const newStatus: AdminAccount["status"] = target.status === "active" ? "suspended" : "active";
          return get().syncAccountsToServer(
            accounts.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
          );
        },

        login: async (username: string, password: string, remember: boolean) => {
          try {
            const res = await fetch("/api/admin/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ username: username.trim(), password: password.trim(), remember }),
            });

            const data = await res.json().catch(() => null);
            if (!res.ok || !data?.success || !data.user) {
              return { success: false, error: data?.error || `Sign-in failed (HTTP ${res.status}).` };
            }

            applySession(data);
            set({ savedUsername: remember ? data.user.username : "", rememberMe: remember });
            return { success: true };
          } catch {
            return { success: false, error: "Unable to reach the server. Please check your connection." };
          }
        },

        // Confirms with the server that the stored session cookie is still valid
        verifySession: async () => {
          try {
            const res = await fetch("/api/admin/session", { cache: "no-store" });
            if (!res.ok) {
              handleUnauthorized(res);
              return false;
            }
            applySession(await res.json());
            return true;
          } catch {
            return get().isAuthenticated;
          }
        },

        logout: () => {
          fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
          set((prev) => ({
            ...SIGNED_OUT,
            savedUsername: prev.rememberMe ? prev.savedUsername : "",
          }));
        },

        updateCredentials: async (oldPassword: string, newPassword: string, newUsername?: string) => {
          if (!get().user) {
            return { success: false, error: "No active session." };
          }

          if (newPassword && newPassword.trim().length < MIN_PASSWORD_LENGTH) {
            return { success: false, error: `New password must be at least ${MIN_PASSWORD_LENGTH} characters long.` };
          }

          try {
            const res = await fetch("/api/admin/change-password", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                currentPassword: oldPassword.trim(),
                newPassword: newPassword.trim(),
                newUsername: newUsername?.trim() || undefined,
              }),
            });
            const data = await res.json().catch(() => null);
            if (!res.ok || !data?.success) {
              return { success: false, error: data?.error || `Update failed (HTTP ${res.status}).` };
            }
            applySession(data);
            if (get().rememberMe) set({ savedUsername: data.user.username });
            return { success: true };
          } catch {
            return { success: false, error: "Unable to reach the server. Please check your connection." };
          }
        },
      };
    },
    {
      name: "tps_admin_auth_v3",
      // Only UI hints are kept locally; the HttpOnly session cookie is what the server trusts
      partialize: (state) => ({
        rolePermissions: state.rolePermissions || DEFAULT_ROLE_PERMISSIONS,
        isAuthenticated: state.rememberMe ? state.isAuthenticated : false,
        user: state.rememberMe ? state.user : null,
        savedUsername: state.rememberMe ? state.savedUsername : "",
        rememberMe: state.rememberMe,
        lastSyncTime: state.lastSyncTime,
      }),
    }
  )
);
