import React from "react";
import StockPage from "./pages/StockPage";
import ScanPage from "./pages/ScanPage";
import { Hexagon, Zap } from "lucide-react";

function App() {
  return (
    <div className="min-h-screen bg-surface-950 text-surface-50 font-sans antialiased">
      {/* Background glow orbs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-brand-900/30 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-indigo-900/20 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Header */}
      <header className="border-b border-surface-800/50 bg-surface-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center">
              <Hexagon className="w-8 h-8 text-brand-500" style={{fill: 'rgba(139,92,246,0.2)'}} />
              <div className="absolute w-2 h-2 bg-brand-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gradient">AI Trading Coach</h1>
              <p className="text-xs text-surface-400">Powered by React · Spring Boot · FastAPI</p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20">
            <Zap className="w-4 h-4 text-brand-400 animate-pulse" />
            <span className="text-xs font-semibold text-brand-300">AI Engine Active</span>
          </div>
        </div>
      </header>

      {/* Architecture Banner */}
      <div className="max-w-6xl mx-auto px-6 pt-8">
        <div className="flex items-center justify-center gap-3 text-xs text-surface-400 bg-surface-900/40 border border-surface-800/50 rounded-full py-2.5 px-6 w-fit mx-auto mb-8">
          <span className="text-brand-300 font-semibold">React UI :5174</span>
          <span>→</span>
          <span className="text-indigo-300 font-semibold">Spring Boot API :8080</span>
          <span>→</span>
          <span className="text-success-400 font-semibold">FastAPI AI Engine :8000</span>
        </div>
      </div>

      {/* Main Grid */}
      <main className="max-w-6xl mx-auto px-6 pb-12 relative z-10">
        <div className="grid md:grid-cols-2 gap-6">
          <StockPage />
          <ScanPage />
        </div>
      </main>
    </div>
  );
}

export default App;