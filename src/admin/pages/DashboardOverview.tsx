import { useState } from "react";
import {
  Users,
  Banknote,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
} from "lucide-react";

export function DashboardOverview({ onOpenEditor }: { onOpenEditor: () => void }) {
  const [payouts, setPayouts] = useState([
    {
      id: "tx_9012",
      user: "Amit Sharma",
      upi: "amit.sharma@okaxis",
      amount: "₹ 15,000",
      time: "2 mins ago",
      status: "pending",
    },
    {
      id: "tx_9011",
      user: "Priya V.",
      upi: "priya99@ybl",
      amount: "₹ 42,500",
      time: "8 mins ago",
      status: "approved",
    },
    {
      id: "tx_9010",
      user: "Karan Johar",
      upi: "karanj@paytm",
      amount: "₹ 8,000",
      time: "15 mins ago",
      status: "approved",
    },
    {
      id: "tx_9009",
      user: "Sunil M.",
      upi: "sunil.m@icici",
      amount: "₹ 1,20,000",
      time: "24 mins ago",
      status: "approved",
    },
  ]);

  const handleApprove = (id: string) => {
    setPayouts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "approved" } : p))
    );
  };

  const handleReject = (id: string) => {
    setPayouts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "rejected" } : p))
    );
  };

  return (
    <div className="space-y-8">
      {/* Top Banner Callout with Quick Launch */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/60 via-[#0a1815] to-[#060e0c] p-6 md:p-8">
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-emerald-500/10 blur-[90px]" />
        <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Production Cluster · Mumbai DC-1
            </div>
            <h2 className="mt-3 text-2xl font-bold text-white md:text-3xl">
              Teen Patti Stars Admin HQ
            </h2>
            <p className="mt-1 text-sm text-white/60">
              50,412 active players online across 4,218 tables. RTP 98.4%.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenEditor}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#ffd96b] via-[#f5c242] to-[#c98a1a] px-5 py-3 text-xs font-bold text-[#1a1205] shadow-[0_10px_30px_rgba(245,194,66,0.3)] transition-all hover:brightness-110 active:scale-95"
            >
              <Layers className="h-4 w-4" />
              <span>Launch Elementor Page Builder</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Total Revenue (Today)",
            value: "₹ 18,42,900",
            change: "+14.2%",
            isPositive: true,
            icon: Banknote,
            accent: "from-amber-400/20 to-amber-600/10 border-amber-400/30 text-amber-300",
          },
          {
            title: "Active Live Players",
            value: "50,412",
            change: "+8.6%",
            isPositive: true,
            icon: Users,
            accent: "from-emerald-400/20 to-emerald-600/10 border-emerald-400/30 text-emerald-300",
          },
          {
            title: "Avg UPI Payout Speed",
            value: "26.4s",
            change: "-2.1s faster",
            isPositive: true,
            icon: Zap,
            accent: "from-cyan-400/20 to-blue-600/10 border-cyan-400/30 text-cyan-300",
          },
          {
            title: "Fair-Play RNG Health",
            value: "99.99%",
            change: "Zero Flags",
            isPositive: true,
            icon: ShieldCheck,
            accent: "from-emerald-400/20 to-teal-600/10 border-emerald-400/30 text-emerald-300",
          },
        ].map((m, i) => {
          const Icon = m.icon;
          return (
            <div
              key={i}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-xl transition-all hover:border-white/20"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-white/50">{m.title}</span>
                <div
                  className={`grid h-9 w-9 place-items-center rounded-xl border bg-gradient-to-br ${m.accent}`}
                >
                  <Icon className="h-4.5 w-4.5" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <div className="text-2xl font-bold tracking-tight text-white">
                  {m.value}
                </div>
                <div
                  className={`flex items-center text-xs font-semibold ${
                    m.isPositive ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {m.isPositive ? (
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  ) : (
                    <ArrowDownRight className="h-3.5 w-3.5" />
                  )}
                  {m.change}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid: Live Payouts Queue + Active Tables Monitoring */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* LEFT: Instant Payouts Approval Queue */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 lg:col-span-7">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="text-base font-semibold text-white">
                Live UPI Payout Queue
              </h3>
              <p className="text-xs text-white/50">
                Instant settlement gateway monitoring
              </p>
            </div>
            <span className="rounded-full bg-amber-400/10 px-2.5 py-1 text-xs font-semibold text-amber-300">
              1 Pending Review
            </span>
          </div>

          <div className="mt-4 divide-y divide-white/5">
            {payouts.map((p) => (
              <div
                key={p.id}
                className="flex flex-col gap-3 py-3.5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">{p.user}</span>
                    <span className="font-mono text-[11px] text-white/40">({p.id})</span>
                  </div>
                  <div className="text-xs text-white/50">{p.upi} · {p.time}</div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm font-bold text-white">{p.amount}</div>
                    <div className="text-[10px] uppercase font-semibold">
                      {p.status === "approved" && (
                        <span className="text-emerald-400">✓ Settled</span>
                      )}
                      {p.status === "pending" && (
                        <span className="text-amber-400">⚡ Auto-checking</span>
                      )}
                      {p.status === "rejected" && (
                        <span className="text-rose-400">✕ Rejected</span>
                      )}
                    </div>
                  </div>

                  {p.status === "pending" && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleApprove(p.id)}
                        className="rounded-lg bg-emerald-500/20 px-2.5 py-1 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/30"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(p.id)}
                        className="rounded-lg bg-rose-500/20 px-2 py-1 text-xs text-rose-300 hover:bg-rose-500/30"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Live High Roller Tables */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 lg:col-span-5">
          <div className="border-b border-white/10 pb-4">
            <h3 className="text-base font-semibold text-white">
              Featured High-Roller Rooms
            </h3>
            <p className="text-xs text-white/50">Real-time pot accumulation</p>
          </div>

          <div className="mt-4 space-y-3">
            {[
              {
                title: "Diwali Mega Table #1",
                boot: "₹500 Boot",
                pot: "₹ 1,24,500",
                players: "6 / 6 Full",
                status: "Live",
              },
              {
                title: "Jaipur Royal High Stakes",
                boot: "₹2,000 Boot",
                pot: "₹ 4,80,000",
                players: "5 / 6 Players",
                status: "Live",
              },
              {
                title: "Goa Midnight VIP Arena",
                boot: "₹10,000 Boot",
                pot: "₹ 18,20,000",
                players: "4 / 6 Players",
                status: "Live",
              },
              {
                title: "Sunday Showdown Qualifier",
                boot: "₹100 Boot",
                pot: "₹ 25,000",
                players: "6 / 6 Full",
                status: "Live",
              },
            ].map((t, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.01] p-3 transition-colors hover:bg-white/[0.03]"
              >
                <div>
                  <div className="text-xs font-semibold text-white">{t.title}</div>
                  <div className="text-[11px] text-white/50">
                    {t.boot} · {t.players}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-amber-300">{t.pot}</div>
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                    {t.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
