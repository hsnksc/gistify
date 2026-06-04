import { useState } from "react";
import {
  Wallet, TrendingUp, TrendingDown, DollarSign, Target,
  Shield, Clock, AlertTriangle, Plus, Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/i18n/I18nContext";

interface Position {
  id: string;
  ticker: string;
  type: "CALL" | "PUT";
  strike: number;
  expiry: string;
  entryPrice: number;
  currentPrice: number;
  quantity: number;
  pnl: number;
  pnlPct: number;
  dte: number;
  status: "OPEN" | "CLOSED";
  thetaRisk: "LOW" | "MEDIUM" | "HIGH";
}

const mockPositions: Position[] = [
  { id: "1", ticker: "ACHR", type: "CALL", strike: 6.5, expiry: "05/06/26", entryPrice: 0.41, currentPrice: 0.47, quantity: 2, pnl: 12, pnlPct: 14.6, dte: 7, status: "OPEN", thetaRisk: "HIGH" },
  { id: "2", ticker: "HOOD", type: "CALL", strike: 110, expiry: "05/06/26", entryPrice: 0.37, currentPrice: 0.21, quantity: 1, pnl: -16, pnlPct: -43.2, dte: 7, status: "OPEN", thetaRisk: "HIGH" },
  { id: "3", ticker: "HOOD", type: "CALL", strike: 102, expiry: "05/06/26", entryPrice: 1.03, currentPrice: 1.04, quantity: 1, pnl: 1, pnlPct: 1.0, dte: 7, status: "OPEN", thetaRisk: "HIGH" },
  { id: "4", ticker: "SOFI", type: "PUT", strike: 18, expiry: "05/06/26", entryPrice: 0.44, currentPrice: 0.48, quantity: 1, pnl: 4, pnlPct: 9.1, dte: 7, status: "OPEN", thetaRisk: "HIGH" },
  { id: "5", ticker: "SOFI", type: "CALL", strike: 19.5, expiry: "05/06/26", entryPrice: 0.22, currentPrice: 0.14, quantity: 1, pnl: -8, pnlPct: -36.4, dte: 7, status: "OPEN", thetaRisk: "HIGH" },
];

export default function PortfolioPage() {
  const { t } = useTranslation();
  const [positions, setPositions] = useState<Position[]>(mockPositions);
  const [showAdd, setShowAdd] = useState(false);
  const [newPos, setNewPos] = useState({ ticker: "", type: "CALL" as "CALL" | "PUT", strike: "", entryPrice: "", quantity: "1", expiry: "06/06/26" });

  const totalPnl = positions.reduce((a, p) => a + p.pnl, 0);
  const totalCost = positions.reduce((a, p) => a + p.entryPrice * p.quantity * 100, 0);
  const openPositions = positions.filter((p) => p.status === "OPEN").length;
  const atRisk = positions.filter((p) => p.dte <= 7).length;

  const handleAdd = () => {
    if (!newPos.ticker || !newPos.strike || !newPos.entryPrice) return;
    const pos: Position = {
      id: Date.now().toString(),
      ticker: newPos.ticker.toUpperCase(),
      type: newPos.type,
      strike: parseFloat(newPos.strike),
      expiry: newPos.expiry,
      entryPrice: parseFloat(newPos.entryPrice),
      currentPrice: parseFloat(newPos.entryPrice),
      quantity: parseInt(newPos.quantity),
      pnl: 0,
      pnlPct: 0,
      dte: 21,
      status: "OPEN",
      thetaRisk: "MEDIUM",
    };
    setPositions([...positions, pos]);
    setShowAdd(false);
    setNewPos({ ticker: "", type: "CALL", strike: "", entryPrice: "", quantity: "1", expiry: "06/06/26" });
  };

  const handleRemove = (id: string) => {
    setPositions(positions.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{t("portfolio.title")}</h1>
          <p className="text-sm text-slate-400 mt-1">{t("portfolio.subtitle")}</p>
        </div>
        <Button onClick={() => setShowAdd(!showAdd)} className="bg-emerald-500 hover:bg-emerald-600 text-white">
          <Plus className="w-4 h-4 mr-1" /> {t("portfolio.addPosition")}
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-slate-900/60 border border-slate-800/60 rounded-xl p-3">
          <p className="text-xs text-slate-500">{t("portfolio.totalPnl")}</p>
          <p className={`text-lg font-bold ${totalPnl >= 0 ? "text-emerald-400" : "text-red-400"}`}>{totalPnl >= 0 ? "+" : ""}${totalPnl}</p>
        </div>
        <div className="bg-slate-900/60 border border-slate-800/60 rounded-xl p-3">
          <p className="text-xs text-slate-500">{t("portfolio.totalValue")}</p>
          <p className="text-lg font-bold text-white">${totalCost.toFixed(0)}</p>
        </div>
        <div className="bg-slate-900/60 border border-slate-800/60 rounded-xl p-3">
          <p className="text-xs text-slate-500">{t("portfolio.openPositions")}</p>
          <p className="text-lg font-bold text-white">{openPositions}</p>
        </div>
        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-3">
          <p className="text-xs text-red-400/70">Theta Risk</p>
          <p className="text-lg font-bold text-red-400">{atRisk} pos.</p>
          <p className="text-[10px] text-red-400/50">DTE ≤ 7</p>
        </div>
        <div className="bg-slate-900/60 border border-slate-800/60 rounded-xl p-3">
          <p className="text-xs text-slate-500">Win Rate</p>
          <p className="text-lg font-bold text-emerald-400">%{Math.round((positions.filter((p) => p.pnl > 0).length / positions.length) * 100)}</p>
        </div>
      </div>

      {/* Add Position Form */}
      {showAdd && (
        <div className="bg-slate-900/60 border border-emerald-500/20 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-emerald-400 mb-3">{t("portfolio.addPosition")}</h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            <Input placeholder="Ticker" value={newPos.ticker} onChange={(e) => setNewPos({ ...newPos, ticker: e.target.value.toUpperCase() })} className="bg-slate-800 border-slate-700 text-white" />
            <select value={newPos.type} onChange={(e) => setNewPos({ ...newPos, type: e.target.value as "CALL" | "PUT" })} className="bg-slate-800 border border-slate-700 text-white rounded-md px-3 text-sm">
              <option value="CALL">CALL</option>
              <option value="PUT">PUT</option>
            </select>
            <Input placeholder="Strike" value={newPos.strike} onChange={(e) => setNewPos({ ...newPos, strike: e.target.value })} className="bg-slate-800 border-slate-700 text-white" />
            <Input placeholder="Entry $" value={newPos.entryPrice} onChange={(e) => setNewPos({ ...newPos, entryPrice: e.target.value })} className="bg-slate-800 border-slate-700 text-white" />
            <Input placeholder="Qty" value={newPos.quantity} onChange={(e) => setNewPos({ ...newPos, quantity: e.target.value })} className="bg-slate-800 border-slate-700 text-white" />
            <Input placeholder="Expiry MM/DD/YY" value={newPos.expiry} onChange={(e) => setNewPos({ ...newPos, expiry: e.target.value })} className="bg-slate-800 border-slate-700 text-white" />
          </div>
          <div className="flex gap-2 mt-3">
            <Button onClick={handleAdd} size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white">{t("misc.add")}</Button>
            <Button onClick={() => setShowAdd(false)} size="sm" variant="outline" className="border-slate-700 text-slate-400">{t("misc.cancel")}</Button>
          </div>
        </div>
      )}

      {/* Positions Table */}
      <div className="bg-slate-900/60 border border-slate-800/60 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800/60">
                <th className="px-3 py-3 text-xs text-slate-400 text-left">{t("resultsTable.ticker")}</th>
                <th className="px-3 py-3 text-xs text-slate-400 text-center">Type</th>
                <th className="px-3 py-3 text-xs text-slate-400 text-center">Strike</th>
                <th className="px-3 py-3 text-xs text-slate-400 text-center">Expiry</th>
                <th className="px-3 py-3 text-xs text-slate-400 text-center">Entry</th>
                <th className="px-3 py-3 text-xs text-slate-400 text-center">Current</th>
                <th className="px-3 py-3 text-xs text-slate-400 text-center">DTE</th>
                <th className="px-3 py-3 text-xs text-slate-400 text-center">P/L</th>
                <th className="px-3 py-3 text-xs text-slate-400 text-center"></th>
              </tr>
            </thead>
            <tbody>
              {positions.map((p) => (
                <tr key={p.id} className="border-b border-slate-800/30 hover:bg-slate-800/30">
                  <td className="px-3 py-3">
                    <span className="font-semibold text-white">{p.ticker}</span>
                    <span className="text-xs text-slate-500 ml-2">x{p.quantity}</span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${p.type === "CALL" ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"}`}>{p.type}</span>
                  </td>
                  <td className="px-3 py-3 text-center text-sm text-slate-300">${p.strike}</td>
                  <td className="px-3 py-3 text-center text-sm text-slate-400">{p.expiry}</td>
                  <td className="px-3 py-3 text-center text-sm text-slate-400">${p.entryPrice.toFixed(2)}</td>
                  <td className="px-3 py-3 text-center text-sm text-slate-300">${p.currentPrice.toFixed(2)}</td>
                  <td className="px-3 py-3 text-center">
                    <span className={`text-xs font-medium ${p.dte <= 7 ? "text-red-400" : p.dte <= 14 ? "text-amber-400" : "text-emerald-400"}`}>{p.dte}</span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span className={`text-sm font-bold ${p.pnl >= 0 ? "text-emerald-400" : "text-red-400"}`}>{p.pnl >= 0 ? "+" : ""}${p.pnl} ({p.pnlPct >= 0 ? "+" : ""}{p.pnlPct.toFixed(1)}%)</span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <button onClick={() => handleRemove(p.id)} className="text-slate-600 hover:text-red-400 transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Risk Warnings */}
      {atRisk > 0 && (
        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <h3 className="text-sm font-semibold text-red-400">Theta {t("scan.timingWarning")}</h3>
          </div>
          <div className="space-y-2">
            {positions.filter((p) => p.dte <= 7).map((p) => (
              <div key={p.id} className="flex items-center justify-between text-sm">
                <span className="text-slate-300">{p.ticker} ${p.strike} {p.type}</span>
                <span className="text-red-400">DTE: {p.dte} gün — Theta decay hızlı!</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
