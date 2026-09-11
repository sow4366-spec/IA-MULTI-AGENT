import { useState, useRef, useEffect, type FormEvent, type KeyboardEvent } from "react";
import { Send, Sparkles, ShieldAlert, Layers, Command, CornerDownLeft, RotateCcw } from "lucide-react";

interface PromptZoneProps {
  onSend: (prompt: string, mode: "godmode-standard" | "godmode-deep-audit" | "godmode-architect") => void;
  isLoading: boolean;
}

const PRESET_PROMPTS = [
  {
    label: "🏗️ Architecture SaaS Multi-Tenant",
    text: "Conçois l'architecture Next.js 14 + Prisma + PostgreSQL d'un SaaS B2B multi-tenant avec isolation des schémas, rate-limiting Redis et RBAC granulaire.",
    mode: "godmode-architect" as const,
  },
  {
    label: "🛡️ Audit de Sécurité & Concurrence",
    text: "Analyse et durcis une route de transaction financière en TypeScript contre les race conditions, doubles dépenses et injections SQL sous haute charge.",
    mode: "godmode-deep-audit" as const,
  },
  {
    label: "⚡ Moteur Godmode Next.js 14 API",
    text: "Génère un gestionnaire d'événements asynchrone pour Next.js 14 App Router avec streaming SSE, reconnexion automatique et typage Zod strict.",
    mode: "godmode-standard" as const,
  },
  {
    label: "🧠 Algorithme de Consensus Distribué",
    text: "Rédige une spécification technique et le code d'un mini-cluster Raft avec élection de leader et quorum de réplication de logs en TypeScript.",
    mode: "godmode-architect" as const,
  },
];

export function PromptZone({ onSend, isLoading }: PromptZoneProps) {
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState<"godmode-standard" | "godmode-deep-audit" | "godmode-architect">("godmode-standard");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 260)}px`;
    }
  }, [prompt]);

  const handleSubmit = (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    onSend(prompt.trim(), mode);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handlePresetSelect = (presetText: string, presetMode: typeof mode) => {
    setPrompt(presetText);
    setMode(presetMode);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div className="w-full relative group">
      {/* Outer ambient glow */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/30 via-indigo-600/30 to-cyan-500/30 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition duration-500"></div>

      {/* Main Glassmorphism Card */}
      <div className="relative rounded-2xl bg-[#0b0b18]/90 backdrop-blur-2xl border border-purple-500/30 shadow-2xl p-4 sm:p-6 transition-all duration-300">
        
        {/* Top Controls: Mode Selector */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3.5 pb-3 border-b border-purple-900/30">
          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-semibold tracking-wide">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>MODALITÉ DU MOTEUR :</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 bg-[#070712] p-1 rounded-xl border border-purple-900/40">
            <button
              type="button"
              id="mode-standard-btn"
              onClick={() => setMode("godmode-standard")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                mode === "godmode-standard"
                  ? "bg-purple-600/90 text-white shadow-md shadow-purple-900/50"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              <Sparkles className="w-3 h-3 text-purple-300" />
              <span>Standard Godmode</span>
            </button>

            <button
              type="button"
              id="mode-audit-btn"
              onClick={() => setMode("godmode-deep-audit")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                mode === "godmode-deep-audit"
                  ? "bg-rose-600/90 text-white shadow-md shadow-rose-900/50"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              <ShieldAlert className="w-3 h-3 text-rose-300" />
              <span>Deep Audit</span>
            </button>

            <button
              type="button"
              id="mode-architect-btn"
              onClick={() => setMode("godmode-architect")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                mode === "godmode-architect"
                  ? "bg-cyan-600/90 text-white shadow-md shadow-cyan-900/50"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              <Layers className="w-3 h-3 text-cyan-300" />
              <span>System Architect</span>
            </button>
          </div>
        </div>

        {/* Textarea Input */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <textarea
              ref={textareaRef}
              id="godmode-prompt-input"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder="Exprimez votre requête complexe (ex: architecture système, audit d'exploit, code Next.js 14 durci, modélisation Prisma)..."
              rows={4}
              className="w-full bg-[#070712]/90 text-slate-100 placeholder:text-slate-500 rounded-xl px-4 py-3.5 text-sm sm:text-base border border-purple-500/20 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all resize-none font-sans leading-relaxed disabled:opacity-50"
            />
            {prompt.length > 0 && !isLoading && (
              <button
                type="button"
                onClick={() => setPrompt("")}
                className="absolute top-3 right-3 text-slate-500 hover:text-slate-300 p-1 rounded-md hover:bg-white/5"
                title="Effacer le prompt"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Preset Chips */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold mr-1">
                Suggestions :
              </span>
              {PRESET_PROMPTS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  id={`preset-prompt-${idx}`}
                  onClick={() => handlePresetSelect(preset.text, preset.mode)}
                  disabled={isLoading}
                  className="px-2.5 py-1 text-[11px] rounded-lg bg-[#0e0e22] text-slate-300 hover:text-white border border-purple-900/40 hover:border-purple-500/50 transition-all truncate max-w-[200px] sm:max-w-none hover:bg-purple-950/30"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 self-end sm:self-auto">
              <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                <Command className="w-3 h-3" />
                <span>+ Entrée</span>
              </div>

              <button
                type="submit"
                id="submit-godmode-btn"
                disabled={!prompt.trim() || isLoading}
                className="relative group/btn overflow-hidden flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm tracking-wide text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 shadow-lg shadow-purple-900/40 hover:shadow-purple-700/60 transition-all duration-300 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out"></div>
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className="relative z-10 font-mono">Inférence Godmode...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 relative z-10 group-hover/btn:translate-x-0.5 transition-transform" />
                    <span className="relative z-10">Envoyer au Moteur</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
