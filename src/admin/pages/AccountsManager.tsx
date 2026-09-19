import { useState, useMemo } from "react";
import {
  Users,
  UserPlus,
  Shield,
  Crown,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Search,
  X,
  Eye,
  EyeOff,
  UserCheck,
  Activity,
  Calendar,
  RotateCcw,
} from "lucide-react";
import {
  useAdminAuthStore,
  DEFAULT_ROLE_PERMISSIONS,
  type AdminAccount,
  type AdminRole,
  type AdminPage,
} from "../../store/adminAuthStore";

const ROLE_OPTIONS: { role: AdminRole; desc: string; badgeClass: string }[] = [
  {
    role: "Super Admin",
    desc: "Full unrestricted privileges across platform, finances, and settings.",
    badgeClass: "bg-amber-400/10 text-amber-300 border-amber-400/30",
  },
  {
    role: "Operations Manager",
    desc: "Access to tournaments, tables, player bonuses, and cashouts.",
    badgeClass: "bg-emerald-400/10 text-emerald-300 border-emerald-400/30",
  },
  {
    role: "Content Editor",
    desc: "Access to pages, visual builder, blogs, footer, and announcements.",
    badgeClass: "bg-sky-400/10 text-sky-300 border-sky-400/30",
  },
  {
    role: "Support Lead",
    desc: "Read-only audit view for customer verification and compliance.",
    badgeClass: "bg-purple-400/10 text-purple-300 border-purple-400/30",
  },
];

const ALL_MODULES: { id: AdminPage; label: string }[] = [
  { id: "dashboard", label: "Dashboard HQ" },
  { id: "pages", label: "Pages Management" },
  { id: "posts", label: "Blog & News Posts" },
  { id: "builder", label: "Elementor Builder" },
  { id: "tournaments", label: "Tournaments & Tables" },
  { id: "bonuses", label: "Bonuses & Offers" },
  { id: "footer", label: "Footer Manager" },
  { id: "settings", label: "Settings & Compliance" },
  { id: "accounts", label: "Team & Accounts" },
];

export function AccountsManager() {
  const {
    accounts,
    user: currentUser,
    addAccount,
    updateAccount,
    deleteAccount,
    toggleAccountStatus,
    rolePermissions: storePermissions,
    toggleRolePermission,
    resetRolePermissionsToDefault,
  } = useAdminAuthStore();

  const activeRolePermissions = storePermissions || DEFAULT_ROLE_PERMISSIONS;

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<AdminAccount | null>(null);
  const [deletingAccountId, setDeletingAccountId] = useState<string | null>(null);

  // Form State for Adding
  const [newName, setNewName] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newRole, setNewRole] = useState<AdminRole>("Operations Manager");
  const [newPassword, setNewPassword] = useState("");
  const [newConfirmPassword, setNewConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Form State for Editing
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState<AdminRole>("Operations Manager");
  const [editPassword, setEditPassword] = useState("");
  const [editConfirmPassword, setEditConfirmPassword] = useState("");
  const [editFormError, setEditFormError] = useState<string | null>(null);

  // Filtered Accounts
  const filteredAccounts = useMemo(() => {
    return accounts.filter((acc) => {
      const matchesSearch =
        acc.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        acc.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === "all" || acc.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [accounts, searchQuery, roleFilter]);

  // Statistics
  const totalAccounts = accounts.length;
  const activeAccounts = accounts.filter((a) => a.status === "active").length;
  const superAdminCount = accounts.filter((a) => a.role === "Super Admin").length;

  const handleOpenAdd = () => {
    setNewName("");
    setNewUsername("");
    setNewRole("Operations Manager");
    setNewPassword("");
    setNewConfirmPassword("");
    setFormError(null);
    setShowAddModal(true);
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!newUsername.trim() || newUsername.trim().length < 3) {
      setFormError("Username must be at least 3 characters.");
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setFormError("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== newConfirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    const res = addAccount({
      username: newUsername,
      name: newName || newUsername,
      role: newRole,
      password: newPassword,
      status: "active",
    });

    if (!res.success) {
      setFormError(res.error || "Failed to create account.");
      return;
    }

    setShowAddModal(false);
    showSuccessBanner(`Account @${newUsername} created successfully!`);
  };

  const handleOpenEdit = (account: AdminAccount) => {
    setEditingAccount(account);
    setEditName(account.name);
    setEditRole(account.role);
    setEditPassword("");
    setEditConfirmPassword("");
    setEditFormError(null);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAccount) return;
    setEditFormError(null);

    if (editPassword && editPassword.length < 6) {
      setEditFormError("New password must be at least 6 characters long.");
      return;
    }

    if (editPassword && editPassword !== editConfirmPassword) {
      setEditFormError("Passwords do not match.");
      return;
    }

    const updates: Partial<AdminAccount> = {
      name: editName,
      role: editRole,
    };

    if (editPassword) {
      updates.password = editPassword;
    }

    const res = updateAccount(editingAccount.id, updates);
    if (!res.success) {
      setEditFormError(res.error || "Failed to update account.");
      return;
    }

    setEditingAccount(null);
    showSuccessBanner(`Account @${editingAccount.username} updated.`);
  };

  const handleConfirmDelete = () => {
    if (!deletingAccountId) return;
    const res = deleteAccount(deletingAccountId);
    if (!res.success) {
      alert(res.error || "Could not delete account.");
    } else {
      showSuccessBanner("Account deleted successfully.");
    }
    setDeletingAccountId(null);
  };

  const handleToggleStatus = (id: string) => {
    const res = toggleAccountStatus(id);
    if (!res.success) {
      alert(res.error || "Could not update status.");
    } else {
      showSuccessBanner("Account status updated.");
    }
  };

  const showSuccessBanner = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white md:text-2xl flex items-center gap-2.5">
            <Users className="h-6 w-6 text-emerald-400" />
            <span>Team & Administrator Accounts</span>
          </h2>
          <p className="mt-1 text-xs text-white/50">
            Create, manage, and authorize team operators with custom role privileges.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:brightness-110 active:scale-95 cursor-pointer"
        >
          <UserPlus className="h-4 w-4" />
          <span>Add New Account</span>
        </button>
      </div>

      {/* Success Notification */}
      {actionSuccess && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs font-semibold text-emerald-300 animate-fadeIn">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/50">Total Admin Accounts</span>
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-400/10 text-emerald-400">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-white">{totalAccounts}</div>
          <div className="mt-1 text-[11px] text-white/40">Registered terminals</div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/50">Active Operators</span>
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <UserCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-300">{activeAccounts}</div>
          <div className="mt-1 text-[11px] text-emerald-400/60">Authorized to sign in</div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/50">Super Admins</span>
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-amber-400/10 text-amber-300">
              <Crown className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-300">{superAdminCount}</div>
          <div className="mt-1 text-[11px] text-white/40">Full master clearance</div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/50">Access Security</span>
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-purple-400/10 text-purple-300">
              <Shield className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-sm font-bold text-purple-300">Zero-Trust Guard</div>
          <div className="mt-1 text-[11px] text-white/40">Isolated per workstation</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-3.5">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-white/40" />
          <input
            type="text"
            placeholder="Search by username or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/40 py-2 pl-9 pr-3 text-xs text-white placeholder-white/40 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-white/50">Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
          >
            <option value="all">All Roles</option>
            <option value="Super Admin">Super Admin</option>
            <option value="Operations Manager">Operations Manager</option>
            <option value="Content Editor">Content Editor</option>
            <option value="Support Lead">Support Lead</option>
          </select>
        </div>
      </div>

      {/* Accounts Table */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/10 bg-white/[0.03] uppercase tracking-wider text-white/50">
              <tr>
                <th className="px-5 py-3.5 font-semibold">User & Terminal</th>
                <th className="px-5 py-3.5 font-semibold">Assigned Role</th>
                <th className="px-5 py-3.5 font-semibold">Status</th>
                <th className="px-5 py-3.5 font-semibold">Last Login</th>
                <th className="px-5 py-3.5 font-semibold">Created</th>
                <th className="px-5 py-3.5 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white/80">
              {filteredAccounts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-white/40">
                    No administrator accounts match your criteria.
                  </td>
                </tr>
              ) : (
                filteredAccounts.map((account) => {
                  const isCurrent = currentUser?.id === account.id;
                  const roleCfg = ROLE_OPTIONS.find((r) => r.role === account.role);

                  return (
                    <tr
                      key={account.id}
                      className="transition-colors hover:bg-white/[0.02]"
                    >
                      {/* User & Terminal */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-700/20 text-emerald-300 font-bold border border-emerald-500/30 shrink-0">
                            {account.username.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-white flex items-center gap-2">
                              <span>{account.name}</span>
                              {isCurrent && (
                                <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-bold text-emerald-300">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="font-mono text-[11px] text-white/40">
                              @{account.username}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
                            roleCfg?.badgeClass || "bg-white/5 text-white/70"
                          }`}
                        >
                          {account.role === "Super Admin" && <Crown className="h-3 w-3" />}
                          {account.role === "Operations Manager" && <Activity className="h-3 w-3" />}
                          {account.role === "Content Editor" && <Edit2 className="h-3 w-3" />}
                          {account.role === "Support Lead" && <Shield className="h-3 w-3" />}
                          <span>{account.role}</span>
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <button
                          onClick={() => handleToggleStatus(account.id)}
                          disabled={isCurrent}
                          title={
                            isCurrent
                              ? "Cannot change status of your active account"
                              : "Click to toggle Active / Suspended"
                          }
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase transition-all ${
                            account.status === "active"
                              ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                              : "bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                          } ${isCurrent ? "cursor-not-allowed opacity-80" : "cursor-pointer"}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              account.status === "active" ? "bg-emerald-400" : "bg-rose-400"
                            }`}
                          />
                          <span>{account.status}</span>
                        </button>
                      </td>

                      {/* Last Login */}
                      <td className="px-5 py-4 text-white/50 text-[11px]">
                        {account.lastLogin || "Never"}
                      </td>

                      {/* Created */}
                      <td className="px-5 py-4 text-white/40 text-[11px]">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {account.createdAt}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(account)}
                            className="grid h-7 w-7 place-items-center rounded-lg border border-white/10 bg-white/5 text-white/70 hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-emerald-300 transition-all cursor-pointer"
                            title="Edit Account / Password"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>

                          <button
                            onClick={() => setDeletingAccountId(account.id)}
                            disabled={isCurrent}
                            className={`grid h-7 w-7 place-items-center rounded-lg border border-white/10 bg-white/5 text-white/40 transition-all ${
                              isCurrent
                                ? "cursor-not-allowed opacity-30"
                                : "hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-400 cursor-pointer"
                            }`}
                            title={
                              isCurrent
                                ? "Cannot delete yourself"
                                : "Delete Account"
                            }
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Permissions & Access Matrix Control Panel */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-400/10 text-amber-300">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Role-Based Access Control (RBAC) Matrix</span>
                <span className="rounded-full bg-emerald-400/10 border border-emerald-400/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                  Live Permission Editor
                </span>
              </h3>
              <p className="text-xs text-white/50">
                Customize module access for each role. Check or uncheck modules to grant or revoke features in real-time.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => resetRolePermissionsToDefault()}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/70 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Default Permissions</span>
          </button>
        </div>

        {/* Permissions Matrix Grid / Table */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-black/40 text-[11px] font-bold text-white/60">
                <th className="py-3 px-4">Admin Module</th>
                {ROLE_OPTIONS.map((opt) => (
                  <th key={opt.role} className="py-3 px-4 text-center">
                    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${opt.badgeClass}`}>
                      {opt.role}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {ALL_MODULES.map((mod) => (
                <tr key={mod.id} className="hover:bg-white/[0.02]">
                  <td className="py-3 px-4 font-medium text-white flex items-center gap-2">
                    <span className="font-semibold text-white">{mod.label}</span>
                    <span className="text-[10px] text-white/40">({mod.id})</span>
                  </td>

                  {ROLE_OPTIONS.map((opt) => {
                    const rolePerms = activeRolePermissions[opt.role] || [];
                    const isChecked = rolePerms.includes(mod.id);
                    const isSuperAdmin = opt.role === "Super Admin";

                    return (
                      <td key={opt.role} className="py-3 px-4 text-center">
                        <label className="inline-flex items-center justify-center p-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            disabled={isSuperAdmin}
                            onChange={() => toggleRolePermission(opt.role, mod.id)}
                            className="h-4.5 w-4.5 rounded accent-emerald-500 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                          />
                        </label>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add New Account */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md rounded-2xl border border-white/15 bg-[#090e12] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-500/15 text-emerald-400">
                  <UserPlus className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Add Administrator Account</h3>
                  <p className="text-[11px] text-white/50">Authorize a new team member</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="grid h-7 w-7 place-items-center rounded-lg text-white/40 hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {formError && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateAccount} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-white/70 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Mehta"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-white/70 mb-1">
                  Login Username
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs text-white/40 font-mono">@</span>
                  <input
                    type="text"
                    required
                    placeholder="vikram"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black/50 py-2 pl-7 pr-3 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-white/70 mb-1">
                  Assigned Role
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as AdminRole)}
                  className="w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                >
                  {ROLE_OPTIONS.map((opt) => (
                    <option key={opt.role} value={opt.role}>
                      {opt.role} — {opt.desc}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-white/70 mb-1">
                  Initial Password (min 6 characters)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black/50 py-2 pl-3 pr-10 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-white/40 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-white/70 mb-1">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••••••"
                  value={newConfirmPassword}
                  onChange={(e) => setNewConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-white/70 hover:bg-white/10 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4.5 py-2 text-xs font-bold text-white shadow hover:brightness-110 active:scale-95 cursor-pointer"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  <span>Create Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Account / Change Password */}
      {editingAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md rounded-2xl border border-white/15 bg-[#090e12] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-sky-500/15 text-sky-400">
                  <Edit2 className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Edit @{editingAccount.username}</h3>
                  <p className="text-[11px] text-white/50">Update details or reset password</p>
                </div>
              </div>
              <button
                onClick={() => setEditingAccount(null)}
                className="grid h-7 w-7 place-items-center rounded-lg text-white/40 hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {editFormError && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{editFormError}</span>
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-white/70 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-white/70 mb-1">
                  Role
                </label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as AdminRole)}
                  className="w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                >
                  {ROLE_OPTIONS.map((opt) => (
                    <option key={opt.role} value={opt.role}>
                      {opt.role} — {opt.desc}
                    </option>
                  ))}
                </select>
              </div>

              <div className="border-t border-white/10 pt-3">
                <span className="text-[11px] font-semibold text-white/70 block mb-1">
                  Change Password (optional)
                </span>
                <p className="text-[10px] text-white/40 mb-2">
                  Leave blank if you do not wish to change this user's password.
                </p>

                <div className="space-y-2">
                  <input
                    type="password"
                    placeholder="New password (min 6 chars)"
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
                  />
                  {editPassword && (
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      value={editConfirmPassword}
                      onChange={(e) => setEditConfirmPassword(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
                    />
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingAccount(null)}
                  className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-white/70 hover:bg-white/10 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4.5 py-2 text-xs font-bold text-white shadow hover:brightness-110 active:scale-95 cursor-pointer"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Delete Confirmation */}
      {deletingAccountId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-sm rounded-2xl border border-rose-500/20 bg-[#090e12] p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400 mb-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-rose-500/10">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Delete Account?</h3>
                <p className="text-[11px] text-white/50">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-white/70 mb-5 leading-relaxed">
              Are you sure you want to permanently revoke this operator's login access?
            </p>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeletingAccountId(null)}
                className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-white/70 hover:bg-white/10 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="rounded-xl bg-rose-500 px-4 py-2 text-xs font-bold text-white shadow hover:bg-rose-600 active:scale-95 cursor-pointer"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
