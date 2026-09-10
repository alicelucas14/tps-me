import { useState } from "react";
import { Plus, Trash2, Users, Calendar } from "lucide-react";

export function TournamentsManager() {
  const [tournaments, setTournaments] = useState([
    {
      id: "t_diwali",
      name: "Diwali ₹25 Crore Mega Gala",
      boot: "₹500",
      prize: "₹ 25,00,00,000",
      registered: "18,420 Players",
      date: "Nov 12 · 9:00 PM IST",
      status: "Registration Open",
      badge: "Featured",
    },
    {
      id: "t_sunday",
      name: "Sunday ₹1 Crore Showdown",
      boot: "₹100",
      prize: "₹ 1,00,00,000",
      registered: "9,140 Players",
      date: "Every Sunday · 8:00 PM",
      status: "Registration Open",
      badge: "Weekly",
    },
    {
      id: "t_royal_goa",
      name: "Goa Royal VIP Masters",
      boot: "₹10,000",
      prize: "₹ 50,00,000",
      registered: "88 / 100 VIPs",
      date: "Oct 28 · Live in Goa + Online",
      status: "VIP Only",
      badge: "VIP Exclusive",
    },
    {
      id: "t_micro",
      name: "Hourly ₹10,000 Rapid Flash",
      boot: "₹10",
      prize: "₹ 10,000",
      registered: "540 Players",
      date: "Every 60 Minutes",
      status: "Live Now",
      badge: "Hourly",
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newBoot, setNewBoot] = useState("₹50");
  const [newPrize, setNewPrize] = useState("₹ 5,00,000");
  const [newDate, setNewDate] = useState("Tomorrow · 8:00 PM");

  const handleAdd = () => {
    if (!newName) return;
    setTournaments([
      ...tournaments,
      {
        id: `t_${Date.now()}`,
        name: newName,
        boot: newBoot,
        prize: newPrize,
        registered: "0 Players",
        date: newDate,
        status: "Registration Open",
        badge: "Special",
      },
    ]);
    setNewName("");
    setShowAddModal(false);
  };

  const handleDelete = (id: string) => {
    setTournaments(tournaments.filter((t) => t.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold text-white">Tournaments & Tables</h2>
          <p className="text-xs text-white/50">
            Configure live real-money tournaments, prize pools, and schedules.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-lg transition-all hover:brightness-110 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>Create New Tournament</span>
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {tournaments.map((t) => (
          <div
            key={t.id}
            className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-all hover:border-emerald-400/30"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-300">
                  {t.badge}
                </span>
                <span className="text-[11px] font-semibold text-emerald-400">
                  {t.status}
                </span>
              </div>

              <h3 className="mt-3 text-base font-semibold text-white">{t.name}</h3>

              <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl border border-white/5 bg-black/40 p-3 text-xs">
                <div>
                  <div className="text-[10px] uppercase text-white/40">Guaranteed Prize</div>
                  <div className="mt-0.5 text-sm font-bold text-amber-300">{t.prize}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase text-white/40">Entry Boot</div>
                  <div className="mt-0.5 text-sm font-bold text-white">{t.boot}</div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-white/50">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{t.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" />
                  <span>{t.registered}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2 border-t border-white/5 pt-3">
              <button
                onClick={() => handleDelete(t.id)}
                className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs text-rose-400 hover:bg-rose-500/10"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Tournament Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0a0f12] p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white">Create New Tournament</h3>
            <p className="text-xs text-white/50">Set title, entry boot, and prize pool.</p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-[11px] text-white/60">Tournament Title</label>
                <input
                  type="text"
                  placeholder="e.g. Diwali Weekend Flash"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-xs text-white focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-white/60">Entry Boot</label>
                  <input
                    type="text"
                    value={newBoot}
                    onChange={(e) => setNewBoot(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-xs text-white focus:border-emerald-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-white/60">Prize Pool</label>
                  <input
                    type="text"
                    value={newPrize}
                    onChange={(e) => setNewPrize(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-xs text-white focus:border-emerald-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-white/60">Schedule Time</label>
                <input
                  type="text"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-xs text-white focus:border-emerald-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-lg border border-white/10 px-4 py-2 text-xs text-white/70 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="rounded-lg bg-emerald-500 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-600"
              >
                Save Tournament
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
