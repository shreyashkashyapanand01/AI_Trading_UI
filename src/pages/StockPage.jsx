import React, { useState } from "react";
import { analyzeStock } from "../services/api";
import { Search, TrendingUp, AlertCircle, Loader2, BrainCircuit } from "lucide-react";

function StockPage() {
  const [symbol, setSymbol] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!symbol.trim()) return;
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await analyzeStock(symbol.toUpperCase());
      setData(res.data);
    } catch (err) {
      setError("Failed to fetch analysis. Make sure the backend is running on port 8080.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAnalyze();
  };

  return (
    <div className="glass-card p-6 flex flex-col gap-5 relative overflow-hidden">
      {/* Decorative orb */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-600 rounded-full blur-3xl opacity-20 pointer-events-none"></div>

      <div className="flex items-center gap-2">
        <BrainCircuit className="w-5 h-5 text-brand-400" />
        <h2 className="text-xl font-bold text-surface-50">Stock Analyzer</h2>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none" />
          <input
            className="w-full bg-surface-900 text-surface-50 placeholder-surface-400 pl-10 pr-4 py-3 rounded-xl border border-surface-700 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all font-medium"
            placeholder="Enter stock symbol (e.g. TCS, INFY)"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <button
          onClick={handleAnalyze}
          disabled={loading || !symbol.trim()}
          className="px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-brand-600 to-indigo-500 text-white hover:from-brand-500 hover:to-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-brand-500/30 flex items-center gap-2 whitespace-nowrap"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing…
            </>
          ) : (
            <>
              <TrendingUp className="w-4 h-4" />
              Analyze
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-3 bg-danger-500/10 border border-danger-500/30 rounded-xl p-4 text-danger-400 text-sm">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      {data && (
        <div className="space-y-4">
          <div className="bg-surface-900/50 border border-surface-700 rounded-xl p-5">
            <p className="text-xs text-surface-400 uppercase font-bold tracking-widest mb-1">Symbol</p>
            <p className="text-2xl font-mono font-bold text-brand-300">{data.symbol}</p>
          </div>

          <div className="bg-surface-900/50 border border-surface-700 rounded-xl p-5">
            <p className="text-xs text-surface-400 uppercase font-bold tracking-widest mb-2">AI Summary</p>
            <p className="text-surface-200 leading-relaxed">{data.summary}</p>
          </div>

          {data.recommendation && (
            <div className={`rounded-xl p-4 border text-sm font-semibold flex items-center gap-2
              ${data.recommendation === "BUY"
                ? "bg-success-500/10 border-success-500/30 text-success-400"
                : data.recommendation === "SELL"
                ? "bg-danger-500/10 border-danger-500/30 text-danger-400"
                : "bg-brand-500/10 border-brand-500/30 text-brand-400"
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Recommendation: {data.recommendation}
            </div>
          )}
        </div>
      )}

      {!data && !error && !loading && (
        <div className="border border-dashed border-surface-700 rounded-xl p-8 text-center text-surface-500 text-sm">
          Enter a stock symbol above and click <span className="text-brand-400 font-semibold">Analyze</span> to get AI-powered insights.
        </div>
      )}
    </div>
  );
}

export default StockPage;