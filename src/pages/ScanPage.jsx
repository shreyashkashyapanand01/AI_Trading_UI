import React, { useState } from "react";
import { scanMarket } from "../services/api";
import { Radar, TrendingUp, TrendingDown, Loader2, AlertCircle } from "lucide-react";

function ScanPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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

  return (
    <div className="glass-card p-6 flex flex-col gap-5 relative overflow-hidden">
      {/* Decorative orb */}
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-success-500 rounded-full blur-3xl opacity-10 pointer-events-none"></div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Radar className="w-5 h-5 text-success-400" />
          <h2 className="text-xl font-bold text-surface-50">Market Scanner</h2>
        </div>
        {scanned && data.length > 0 && (
          <span className="text-xs font-semibold bg-success-500/10 text-success-400 border border-success-500/20 px-2.5 py-1 rounded-full">
            {data.length} opportunities found
          </span>
        )}
      </div>

      <button
        onClick={handleScan}
        disabled={loading}
        className="w-full py-3.5 rounded-xl font-bold bg-gradient-to-r from-success-500 to-emerald-400 text-surface-950 hover:from-success-400 hover:to-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-success-500/30 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Scanning Market…
          </>
        ) : (
          <>
            <Radar className="w-4 h-4" />
            Scan Market
          </>
        )}
      </button>

      {error && (
        <div className="flex items-start gap-3 bg-danger-500/10 border border-danger-500/30 rounded-xl p-4 text-danger-400 text-sm">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      {data.length > 0 && (
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
          {data.map((item, idx) => (
            <div
              key={idx}
              className="bg-surface-900/50 border border-surface-700 rounded-xl p-4 hover:border-surface-600 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-surface-50 text-lg">{item.symbol}</span>
                  <span className="text-xs text-surface-400 bg-surface-800 px-2 py-0.5 rounded">{item.sector}</span>
                </div>
                <div className={`flex items-center gap-1 text-sm font-semibold px-2.5 py-1 rounded-lg
                  ${item.momentum === "UP" || (item.score && item.score > 50)
                    ? "bg-success-500/10 text-success-400"
                    : "bg-danger-500/10 text-danger-400"
                  }`}
                >
                  {item.momentum === "UP" ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  Score: {item.score}
                </div>
              </div>
              <p className="text-sm text-surface-400 leading-relaxed">{item.summary}</p>
            </div>
          ))}
        </div>
      )}

      {scanned && data.length === 0 && (
        <div className="border border-dashed border-surface-700 rounded-xl p-8 text-center text-surface-500 text-sm">
          No opportunities found in the current market scan.
        </div>
      )}

      {!scanned && !error && (
        <div className="border border-dashed border-surface-700 rounded-xl p-8 text-center text-surface-500 text-sm">
          Click <span className="text-success-400 font-semibold">Scan Market</span> to discover AI-powered trading opportunities.
        </div>
      )}
    </div>
  );
}

export default ScanPage;