import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

export function BonusesManager() {
  const [coupons, setCoupons] = useState([
    {
      code: "STARS500",
      type: "Signup Credit",
      value: "₹ 500 Free",
      minDeposit: "₹ 0",
      rollover: "5x",
      active: true,
      uses: "1,24,500",
    },
    {
      code: "DIWALI100",
      type: "Deposit Match",
      value: "100% Match up to ₹10,000",
      minDeposit: "₹ 1,000",
      rollover: "3x",
      active: true,
      uses: "42,100",
    },
    {
      code: "ROYALVIP",
      type: "VIP Rakeback",
      value: "30% Instant Rakeback",
      minDeposit: "₹ 5,000",
      rollover: "1x",
      active: true,
      uses: "8,900",
    },
  ]);

  const [newCode, setNewCode] = useState("");
  const [newValue, setNewValue] = useState("");

  const handleAdd = () => {
    if (!newCode || !newValue) return;
    setCoupons([
      ...coupons,
      {
        code: newCode.toUpperCase(),
        type: "Promo Bonus",
        value: newValue,
        minDeposit: "₹ 500",
        rollover: "4x",
        active: true,
        uses: "0",
      },
    ]);
    setNewCode("");
    setNewValue("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Bonuses & Promo Codes</h2>
        <p className="text-xs text-white/50">
          Manage signup rewards, rakeback percentages, and promotional coupons.
        </p>
      </div>

      {/* Add Code Bar */}
      <div className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:flex-row sm:items-center">
        <input
          type="text"
          placeholder="Coupon Code (e.g. FESTIVE200)"
          value={newCode}
          onChange={(e) => setNewCode(e.target.value)}
          className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs text-white placeholder-white/30 focus:border-emerald-400 focus:outline-none uppercase"
        />
        <input
          type="text"
          placeholder="Offer Benefit (e.g. ₹200 Free Bonus)"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          className="flex-1 rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs text-white placeholder-white/30 focus:border-emerald-400 focus:outline-none"
        />
        <button
          onClick={handleAdd}
          className="flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-600 active:scale-95"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Offer</span>
        </button>
      </div>

      {/* Coupons Table */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-white/10 bg-white/[0.03] text-[11px] uppercase text-white/50">
            <tr>
              <th className="px-5 py-3.5">Promo Code</th>
              <th className="px-5 py-3.5">Type</th>
              <th className="px-5 py-3.5">Value / Reward</th>
              <th className="px-5 py-3.5">Min Deposit</th>
              <th className="px-5 py-3.5">Total Redeemed</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-white/80">
            {coupons.map((c, i) => (
              <tr key={i} className="hover:bg-white/[0.01]">
                <td className="px-5 py-4 font-mono font-bold text-amber-300">
                  {c.code}
                </td>
                <td className="px-5 py-4 text-white/60">{c.type}</td>
                <td className="px-5 py-4 font-semibold text-white">{c.value}</td>
                <td className="px-5 py-4 text-white/50">{c.minDeposit}</td>
                <td className="px-5 py-4 font-medium text-white">{c.uses}</td>
                <td className="px-5 py-4">
                  <span className="rounded-full bg-emerald-400/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                    Active
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <button
                    onClick={() => setCoupons(coupons.filter((_, idx) => idx !== i))}
                    className="p-1 text-rose-400 hover:text-rose-300"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
