import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { TopNav  } from "./components/TopNav";
import StockPage   from "./pages/StockPage";
import ScanPage    from "./pages/ScanPage";
import TradePage   from "./pages/TradePage";
import PortfolioPage from "./pages/PortfolioPage";
function App() {
  const [activePage, setActivePage] = useState("advisor");
  const [darkMode,   setDarkMode]   = useState(true);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
        {/* Sidebar */}
        <Sidebar activePage={activePage} setActivePage={setActivePage} />

        {/* Main area */}
        <div className="flex-1 flex flex-col min-w-0">
          <TopNav
            activePage={activePage}
            setActivePage={setActivePage}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />

          <main className="flex-1 p-4 md:p-8 max-w-5xl w-full mx-auto">
            {activePage === "advisor"  && <StockPage />}
            {activePage === "scanner" && <ScanPage />}
            {activePage === "trades"  && <TradePage />}
            {activePage === "portfolio" && <PortfolioPage />}
          </main>

          {/* Footer */}
          <footer className="border-t border-slate-800/60 px-6 py-3 flex items-center justify-between text-[10px] text-slate-600">
            <span>AI Trading Coach © 2026</span>
            <span className="flex items-center gap-3">
              <span>React 19</span>
              <span>·</span>
              <span>Spring Boot :8080</span>
              <span>·</span>
              <span>FastAPI :8000</span>
            </span>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default App;