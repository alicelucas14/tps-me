import React, { useState } from "react";
import {
  Crown,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  KeyRound,
  Sparkles,
} from "lucide-react";
import { useAdminAuthStore } from "../../store/adminAuthStore";

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onExitToSite: () => void;
}

export function AdminLogin({ onLoginSuccess, onExitToSite }: AdminLoginProps) {
  const { login, savedUsername, rememberMe: initialRememberMe } = useAdminAuthStore();

  const [username, setUsername] = useState(savedUsername || "admin");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(initialRememberMe ?? true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim()) {
      setError("Please enter your administrator username.");
      triggerShake();
      return;
    }

    if (!password.trim()) {
      setError("Please enter your access password.");
      triggerShake();
      return;
    }

    setLoading(true);

    // Simulate snappy secure handshake
    setTimeout(() => {
      const result = login(username, password, rememberMe);
      setLoading(false);

      if (result.success) {
        onLoginSuccess();
      } else {
        setError(result.error || "Authentication failed. Access denied.");
        triggerShake();
      }
    }, 400);
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleFillDemo = () => {
    setUsername("admin");
    setPassword("admin123");
    setError(null);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#040709] text-white flex flex-col justify-between selection:bg-emerald-500 selection:text-black">
      {/* Dynamic Background Ambient Gradients */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-10%] h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.18),transparent_70%)] blur-[100px]" />
        <div className="absolute right-[-10%] top-[40%] h-[450px] w-[450px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(245,194,66,0.12),transparent_70%)] blur-[120px]" />
        <div className="absolute left-[-10%] bottom-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.1),transparent_70%)] blur-[100px]" />
        <div className="absolute inset-0 grid-pattern opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />
      </div>

      {/* Top Header Navigation */}
      <header className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto w-full">
        <button
          onClick={onExitToSite}
          type="button"
          className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/70 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5 text-emerald-400" />
          <span>Return to Live Site</span>
        </button>

        <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-[11px] font-semibold text-emerald-300 backdrop-blur-md">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Internal Operations Terminal</span>
        </div>
      </header>

      {/* Main Login Card Area */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div
          className={`w-full max-w-[440px] transition-transform ${
            shake ? "animate-shake" : ""
          }`}
        >
          {/* Glass Card Container */}
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#090e12]/80 p-8 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.8)] backdrop-blur-2xl md:p-10">
            {/* Top Glow Accent */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400/80 to-transparent" />

            {/* Brand Crown Icon */}
            <div className="mx-auto mb-6 flex flex-col items-center text-center">
              <div className="relative mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-emerald-400 via-emerald-600 to-emerald-800 shadow-[0_0_35px_rgba(16,185,129,0.35)] ring-1 ring-white/20">
                <Crown className="h-8 w-8 text-[#f5c242]" strokeWidth={2.2} />
                <div className="absolute -inset-1 rounded-2xl bg-emerald-400/20 blur-md -z-10" />
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                Command <span className="text-emerald-400">HQ</span>
              </h1>
              <p className="mt-1.5 text-xs text-white/50 max-w-xs">
                Enter your authorized credentials to access platform configuration, player tables, and cash flow operations.
              </p>
            </div>

            {/* Error Notification Banner */}
            {error && (
              <div className="mb-6 flex items-start gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-300">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-400" />
                <div className="flex-1">
                  <p className="font-semibold">{error}</p>
                </div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Field */}
              <div>
                <label
                  htmlFor="admin-username"
                  className="block text-[11px] font-semibold uppercase tracking-wider text-white/70 mb-1.5"
                >
                  Admin Username
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-white/40">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    id="admin-username"
                    type="text"
                    autoComplete="username"
                    required
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setError(null);
                    }}
                    placeholder="e.g. admin"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/30 transition-all focus:border-emerald-500 focus:bg-white/[0.06] focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="admin-password"
                  className="block text-[11px] font-semibold uppercase tracking-wider text-white/70 mb-1.5"
                >
                  Access Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-white/40">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError(null);
                    }}
                    placeholder="••••••••••••"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-11 text-sm text-white placeholder-white/30 transition-all focus:border-emerald-500 focus:bg-white/[0.06] focus:outline-none focus:ring-1 focus:ring-emerald-500/50 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-white/40 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Demo Fill row */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-white/60 hover:text-white/80 transition-colors">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-white/20 bg-white/5 text-emerald-500 focus:ring-emerald-500/50 focus:ring-offset-0 accent-emerald-500"
                  />
                  <span>Remember this workstation</span>
                </label>

                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400/90 hover:text-amber-300 transition-colors"
                >
                  <Sparkles className="h-3 w-3" />
                  <span>Demo Fill</span>
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 py-3 text-sm font-bold text-white shadow-[0_10px_30px_-10px_rgba(16,185,129,0.5)] transition-all hover:brightness-110 active:scale-[0.99] disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <>
                    <KeyRound className="h-4 w-4" />
                    <span>Authorize Session</span>
                  </>
                )}
              </button>
            </form>

            {/* Default credentials tip pill */}
            <div className="mt-6 rounded-xl border border-white/5 bg-white/[0.02] p-3 text-center">
              <span className="text-[11px] text-white/40 block">
                Default Credentials:{" "}
                <code className="text-emerald-300/80 font-mono bg-white/5 px-1 py-0.5 rounded">admin</code>{" "}
                /{" "}
                <code className="text-emerald-300/80 font-mono bg-white/5 px-1 py-0.5 rounded">admin123</code>
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Security Badges */}
      <footer className="py-6 px-6 text-center text-[11px] text-white/40 flex flex-wrap items-center justify-center gap-6">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          256-Bit SSL Encrypted Terminal
        </span>
        <span className="hidden sm:inline text-white/20">·</span>
        <span>Teen Patti Stars Gaming Framework v8.4</span>
        <span className="hidden sm:inline text-white/20">·</span>
        <span>Zero-Trust Authorization Gate</span>
      </footer>
    </div>
  );
}
