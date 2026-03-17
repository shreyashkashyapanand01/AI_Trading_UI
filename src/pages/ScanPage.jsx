import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { scanMarket } from "../services/api";
import {
  Radar, TrendingUp, TrendingDown, Loader2, AlertCircle,
  Filter, BarChart2, ChevronUp, ChevronDown,
} from "lucide-react";
import { Badge, AlertBox, SkeletonBlock } from "../components/ui";

/* ── helpers ─────────────────────────────────────────── */
function scoreColor(score) {
  if (score >= 7) return "text-emerald-400";
  if (score >= 4) return "text-yellow-400";
  return "text-red-400";
}
function scoreBar(score, max = 10) {
  const pct = Math.min(100, (score / max) * 100);
  const color = score >= 7 ? "bg-emerald-500" : score >= 4 ? "bg-yellow-500" : "bg-red-500";
  return { pct, color };
}

const SECTORS = ["All", "NIFTY", "FOSec", "SecGtr20", "SecLwr20"];
const SORT_OPTIONS = [
  { label: "Score ↓", key: "score",    dir: "desc" },
  { label: "Score ↑", key: "score",    dir: "asc"  },
  { label: "Momentum↓", key: "momentum", dir: "desc" },
];

const StockCard = ({ item, index }) => {
  const { pct, color } = scoreBar(item.score);
  const isUp = item.momentum > 10;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="bg-slate-900 border border-slate-800/60 rounded-2xl p-4 hover:border-slate-700 hover:shadow-lg hover:shadow-black/20 transition-all duration-200 group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-mono font-bold text-white text-base group-hover:text-violet-300 transition-colors">
            {item.symbol}
          </p>
          <span className="inline-block text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded mt-1 font-medium">
            {item.sector}
          </span>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`font-mono font-bold text-lg leading-none ${scoreColor(item.score)}`}>
            {item.score.toFixed(1)}
          </span>
          <span className="text-[10px] text-slate-500">score</span>
        </div>
      </div>

      {/* Score bar */}
      <div className="mb-3">
        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${color} rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6, delay: index * 0.04 + 0.2 }}
          />
        </div>
      </div>

      {/* Momentum badge */}
      <div className="flex items-center justify-between mb-3">
        <div className={`flex items-center gap-1 text-xs font-semibold
          ${isUp ? "text-emerald-400" : "text-red-400"}`}
        >
          {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          Momentum: {item.momentum.toFixed(1)}
        </div>
        <Badge
          label={isUp ? "bullish" : "bearish"}
          variant={isUp ? "bullish" : "bearish"}
        />
      </div>

      {/* Summary */}
      <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
        {item.summary}
      </p>
    </motion.div>
  );
};

/* ── skeleton grid ───────────────────────────────────── */
function ScanSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonBlock key={i} className="h-44" />
      ))}
    </div>
  );
}

/* ── main component ──────────────────────────────────── */
function ScanPage() {
  // ── unchanged business logic ──
  const [data,    setData]    = useState([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const [scanned, setScanned] = useState(false);

  const handleScan = async () => {
    setLoading(true);
    setError(null);
    setScanned(false);
    try {
      const res = await scanMarket();
      setData(res.data.opportunities || []);
      setScanned(true);
    } catch (err) {
      setError("Failed to scan market. Make sure the backend is running on port 8080.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ── UI-only filter/sort state ──
  const [sector, setSector]   = useState("All");
  const [sortIdx, setSortIdx] = useState(0);

  const filtered = useMemo(() => {
    const s = SORT_OPTIONS[sortIdx];
    return [...data]
      .filter((d) => sector === "All" || d.sector === sector)
      .sort((a, b) =>
        s.dir === "desc" ? b[s.key] - a[s.key] : a[s.key] - b[s.key]
      );
  }, [data, sector, sortIdx]);

  return (
    <div className="space-y-5">
      {/* ── Trigger button ─────────────────────────────── */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleScan}
          disabled={loading}
          className="px-6 py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-emerald-600 to-teal-500 text-white hover:from-emerald-500 hover:to-teal-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 flex items-center gap-2"
        >
          {loading
            ? <><Loader2 className="w-4 h-4 animate-spin" />Scanning…</>
            : <><Radar className="w-4 h-4" />Scan Market</>}
        </button>

        {scanned && data.length > 0 && (
          <span className="text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-full">
            {data.length} opportunities found
          </span>
        )}
      </div>

      {error && <AlertBox message={error} />}
      {loading && <ScanSkeleton />}

      {/* ── Filters (UI-only) ─────────────────────────── */}
      {scanned && data.length > 0 && !loading && (
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </div>
          {SECTORS.map((s) => (
            <button
              key={s}
              onClick={() => setSector(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors
                ${sector === s
                  ? "bg-violet-500/15 text-violet-300 border-violet-500/30"
                  : "bg-transparent text-slate-500 border-slate-700 hover:border-slate-600 hover:text-slate-300"
                }`}
            >
              {s}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-1.5 text-xs text-slate-500">
            <BarChart2 className="w-3.5 h-3.5" /> Sort:
          </div>
          {SORT_OPTIONS.map((opt, i) => (
            <button
              key={i}
              onClick={() => setSortIdx(i)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors
                ${sortIdx === i
                  ? "bg-indigo-500/15 text-indigo-300 border-indigo-500/30"
                  : "bg-transparent text-slate-500 border-slate-700 hover:border-slate-600 hover:text-slate-300"
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {/* ── Cards ─────────────────────────────────────── */}
      <AnimatePresence>
        {filtered.length > 0 && !loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((item, idx) => (
              <StockCard key={item.symbol + idx} item={item} index={idx} />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Empty / initial states */}
      {scanned && data.length === 0 && !loading && (
        <div className="py-20 text-center text-slate-500 text-sm">
          No opportunities found in the current scan.
        </div>
      )}
      {!scanned && !error && !loading && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
            <Radar className="w-6 h-6 text-emerald-400" />
          </div>
          <h3 className="text-slate-300 font-semibold mb-1">Ready to scan</h3>
          <p className="text-sm text-slate-500 max-w-xs">
            Click <span className="text-emerald-400 font-semibold">Scan Market</span> to find AI-ranked trading opportunities.
          </p>
        </div>
      )}
    </div>
  );
}

export default ScanPage;