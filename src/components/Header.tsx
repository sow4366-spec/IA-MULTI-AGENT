import { Cpu, Zap, Code2, Database, Sparkles } from "lucide-react";

interface HeaderProps {
  activeTab: "engine" | "export" | "sessions";
  setActiveTab: (tab: "engine" | "export" | "sessions") => void;
  sessionsCount: number;
}

export function Header({ activeTab, setActiveTab, sessionsCount }: HeaderProps) {
  return (
    <header className="relative z-20 w-full border-b border-purple-900/30 bg-[#070712]/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Identity */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-[1px] shadow-lg shadow-purple-950/50">
            <div className="w-full h-full bg-[#0b0b18] rounded-[11px] flex items-center justify-center">
              <Zap className="w-5 h-5 text-cyan-300 animate-pulse" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-purple-300">
                AI GODMODE ENGINE
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20">
                v1.0
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
              <span className="text-cyan-400 font-mono">NEXT.JS 14</span>
              <span>•</span>
              <span className="text-purple-400 font-mono">GPT-4O-MINI</span>
              <span>•</span>
              <span className="text-indigo-400 font-mono">PRISMA ORM</span>
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#0e0e22] border border-purple-900/40 text-xs font-medium">
          <button
            id="tab-engine-btn"
            onClick={() => setActiveTab("engine")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all duration-200 ${
              activeTab === "engine"
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-950/60"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>Moteur IA</span>
          </button>

          <button
            id="tab-export-btn"
            onClick={() => setActiveTab("export")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all duration-200 ${
              activeTab === "export"
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-950/60"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-purple-300" />
            <span>Code Next.js & Vercel</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-purple-950/80 text-purple-300 border border-purple-800/50">
              7
            </span>
          </button>

          <button
            id="tab-sessions-btn"
            onClick={() => setActiveTab("sessions")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all duration-200 ${
              activeTab === "sessions"
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-950/60"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
            }`}
          >
            <Database className="w-3.5 h-3.5 text-indigo-300" />
            <span>Sessions Prisma</span>
            {sessionsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {sessionsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
