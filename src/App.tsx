import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { PromptZone } from "./components/PromptZone";
import { ResponseCard } from "./components/ResponseCard";
import { NextExportModal } from "./components/NextExportModal";
import { SessionsDrawer } from "./components/SessionsDrawer";
import { GodmodeResponse, SavedSession } from "./types";
import { Sparkles, Terminal, ShieldCheck, Zap, AlertCircle } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"engine" | "export" | "sessions">("engine");
  const [isLoading, setIsLoading] = useState(false);
  const [currentResponse, setCurrentResponse] = useState<GodmodeResponse | null>(null);
  const [sessions, setSessions] = useState<SavedSession[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Charger les sessions au montage
  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await fetch("/api/sessions");
      if (res.ok) {
        const data = await res.json();
        if (data.sessions) {
          setSessions(data.sessions);
        }
      }
    } catch (e) {
      console.warn("Impossible de charger les sessions locales:", e);
    }
  };

  const handleSendPrompt = async (
    prompt: string,
    mode: "godmode-standard" | "godmode-deep-audit" | "godmode-architect"
  ) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/godmode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, mode }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || `Erreur serveur (${res.status})`);
      }

      setCurrentResponse(data);
      fetchSessions(); // Actualise l'historique des sessions
    } catch (err: any) {
      console.error("[GODMODE_CLIENT_ERROR]", err);
      setErrorMessage(err?.message || "Erreur de communication avec le moteur GODMODE.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSession = async (id: string) => {
    try {
      await fetch(`/api/sessions/${id}`, { method: "DELETE" });
      setSessions((prev) => prev.filter((s) => s.id !== id));
    } catch (e) {
      console.error("Erreur suppression session:", e);
    }
  };

  const handleSelectPastSession = (session: SavedSession) => {
    setCurrentResponse({
      success: true,
      prompt: session.prompt,
      response: session.response,
      engine: session.engine,
      model: "GPT-4O-MINI",
      metrics: {
        durationMs: 420,
        tokensEstimated: Math.round(session.response.split(" ").length * 1.3),
        timestamp: session.createdAt,
      },
      reasoning: {
        intent: "Session Historique Restituée",
        complexityLevel: "ARCHIVÉ",
        keyDirectives: ["Données extraites du modèle Prisma Session"],
      },
    });
    setActiveTab("engine");
  };

  return (
    <div className="relative min-h-screen bg-[#070712] text-slate-100 flex flex-col font-sans overflow-x-hidden selection:bg-purple-500/30 selection:text-purple-200">
      {/* Dynamic Background Effects: Grid + Radial Glowing Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-grid-cyber opacity-30"></div>
        {/* Purple Top Orb */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-purple-700/25 via-indigo-600/15 to-transparent blur-[120px] rounded-full"></div>
        {/* Cyan Bottom Left Orb */}
        <div className="absolute bottom-10 -left-20 w-[450px] h-[450px] bg-cyan-600/10 blur-[130px] rounded-full"></div>
        {/* Blue Bottom Right Orb */}
        <div className="absolute bottom-20 -right-20 w-[500px] h-[500px] bg-purple-900/15 blur-[140px] rounded-full"></div>
      </div>

      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sessionsCount={sessions.length}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 flex flex-col items-center">
        
        {/* TAB 1: Engine Studio (Active View) */}
        {activeTab === "engine" && (
          <div className="w-full space-y-8">
            {/* Hero Subheader */}
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/30 text-xs font-semibold text-purple-300 shadow-sm shadow-purple-900/40">
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                <span>Next.js 14 • OpenAI GPT-4o-mini • Prisma 5</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-purple-300">
                L'Intelligence Sans Compromis
              </h2>

              <p className="text-sm text-slate-400 leading-relaxed font-sans">
                Génération de code durci, analyse forensique et conception système à ultra-haute fidélité.
                Exécutez vos requêtes ci-dessous ou exportez le code Next.js 14 complet pour Vercel.
              </p>
            </div>

            {/* Error Notification if any */}
            {errorMessage && (
              <div className="w-full p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-start gap-3 backdrop-blur-md">
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold block">Incident de communication API :</span>
                  <span>{errorMessage}</span>
                </div>
              </div>
            )}

            {/* Prompt Zone Component */}
            <PromptZone onSend={handleSendPrompt} isLoading={isLoading} />

            {/* Response Card Component */}
            <ResponseCard
              response={currentResponse}
              isLoading={isLoading}
              onSaveSession={fetchSessions}
            />
          </div>
        )}

        {/* TAB 2: Next.js 14 Deliverables & Vercel */}
        {activeTab === "export" && <NextExportModal />}

        {/* TAB 3: Sessions DB (Prisma) */}
        {activeTab === "sessions" && (
          <SessionsDrawer
            sessions={sessions}
            onSelectSession={handleSelectPastSession}
            onDeleteSession={handleDeleteSession}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-purple-900/30 bg-[#05050f]/80 backdrop-blur-md py-4 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>AI GODMODE ENGINE © 2026 // Next.js 14 & OpenAI Architecture</span>
          <div className="flex items-center gap-4">
            <span className="text-purple-400">Dark Futuriste + Glassmorphism</span>
            <span>•</span>
            <span className="text-cyan-400">Prisma Session Model</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
