import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Copy,
  Check,
  Cpu,
  Clock,
  Zap,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Terminal,
  BookmarkPlus,
  Share2,
} from "lucide-react";
import { GodmodeResponse } from "../types";

interface ResponseCardProps {
  response: GodmodeResponse | null;
  isLoading: boolean;
  onSaveSession?: () => void;
}

export function ResponseCard({ response, isLoading, onSaveSession }: ResponseCardProps) {
  const [copied, setCopied] = useState(false);
  const [showReasoning, setShowReasoning] = useState(false);

  const handleCopy = () => {
    if (!response?.response) return;
    navigator.clipboard.writeText(response.response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full relative rounded-2xl bg-[#0b0b18]/80 backdrop-blur-xl border border-purple-500/20 p-6 sm:p-8 overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-purple-600 animate-pulse"></div>
        <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
          <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-950/40 border border-purple-500/30">
            <Cpu className="w-8 h-8 text-cyan-400 animate-spin" style={{ animationDuration: "3s" }} />
            <div className="absolute inset-0 rounded-2xl border border-cyan-400/40 animate-ping"></div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-wide">
              SYNTHÈSE GODMODE EN COURS...
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              Décomposition multi-angles, calcul des contraintes d'architecture et inférence GPT-4o-mini.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-purple-300/80 font-mono bg-purple-950/40 px-3 py-1.5 rounded-lg border border-purple-800/30">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
            <span>Raisonnement logique & durcissement du code</span>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!response) {
    return (
      <div className="w-full rounded-2xl bg-[#0b0b18]/40 backdrop-blur-md border border-purple-900/20 p-8 sm:p-12 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-950/30 border border-purple-800/30 mb-3 text-purple-400">
          <Terminal className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-300">
          En attente d'une directive
        </h3>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
          Saisissez une invite dans la console ci-dessus ou sélectionnez l'un des modèles d'architecture pour initier le moteur GODMODE.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full relative rounded-2xl bg-[#0b0b18]/90 backdrop-blur-2xl border border-purple-500/30 shadow-2xl overflow-hidden"
    >
      {/* Top Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5 bg-[#0e0e22]/90 border-b border-purple-900/30">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-950/80 border border-purple-500/40 text-xs font-semibold text-purple-200">
            <Zap className="w-3.5 h-3.5 text-cyan-300" />
            <span>{response.model || "GPT-4O-MINI"}</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
            <Clock className="w-3 h-3 text-slate-500" />
            <span>{response.metrics?.durationMs ?? 0} ms</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
            <Cpu className="w-3 h-3 text-slate-500" />
            <span>~{response.metrics?.tokensEstimated ?? 0} tokens</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {response.reasoning && (
            <button
              type="button"
              id="toggle-reasoning-btn"
              onClick={() => setShowReasoning(!showReasoning)}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-700/40 transition-colors"
            >
              <span>Raisonnement</span>
              {showReasoning ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          )}

          <button
            type="button"
            id="copy-response-btn"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg bg-[#14142e] hover:bg-purple-900/40 text-slate-200 border border-purple-800/40 transition-all hover:border-purple-500"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">Copié !</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copier</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Expandable Reasoning Breakdown */}
      <AnimatePresence>
        {showReasoning && response.reasoning && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-purple-900/30 bg-[#070712]/95 px-4 sm:px-6 py-3.5"
          >
            <div className="text-xs space-y-2 font-mono">
              <div className="flex items-center justify-between text-slate-400">
                <span>INTENTION DÉTECTÉE :</span>
                <span className="text-cyan-300 font-semibold">{response.reasoning.intent}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>COMPLEXITÉ CALCULÉE :</span>
                <span className="text-purple-300 font-semibold">{response.reasoning.complexityLevel}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">DIRECTIVES GODMODE APPLIQUÉES :</span>
                <ul className="list-disc list-inside space-y-0.5 text-slate-300 pl-1">
                  {response.reasoning.keyDirectives?.map((directive, i) => (
                    <li key={i}>{directive}</li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Response Content */}
      <div className="p-5 sm:p-7 space-y-4">
        {/* User Prompt reminder */}
        <div className="p-3 rounded-xl bg-[#080816] border border-purple-900/30 text-xs text-slate-400 flex items-start gap-2.5">
          <span className="text-purple-400 font-bold uppercase tracking-wider text-[10px] mt-0.5">
            PROMPT:
          </span>
          <p className="text-slate-200 line-clamp-2 italic font-sans">{response.prompt}</p>
        </div>

        {/* Parsed & Formatted Output */}
        <div className="prose prose-invert max-w-none text-slate-200 text-sm leading-relaxed font-sans">
          <ResponseContentFormatter text={response.response} />
        </div>
      </div>

      {/* Bottom Footer Details */}
      <div className="px-5 sm:px-7 py-3 bg-[#080816]/70 border-t border-purple-900/20 flex flex-wrap items-center justify-between text-[11px] text-slate-500 font-mono">
        <span>ENGINE: {response.engine || "godmode-core-v1"}</span>
        <span>HORODATAGE: {new Date(response.metrics?.timestamp || Date.now()).toLocaleTimeString()}</span>
      </div>
    </motion.div>
  );
}

/**
 * Composant de formatage du texte avec rendu de blocs de code élégants
 */
function ResponseContentFormatter({ text }: { text: string }) {
  if (!text) return null;

  // Découpage en blocs de code markdown (```...```) et texte standard
  const parts = text.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-3">
      {parts.map((part, index) => {
        if (part.startsWith("```")) {
          const match = part.match(/```(\w+)?\n([\s\S]*?)```/);
          const lang = match ? match[1] || "typescript" : "typescript";
          const code = match ? match[2] : part.slice(3, -3);

          return (
            <div key={index}>
              <CodeSnippetBlock code={code.trim()} language={lang} />
            </div>
          );
        }

        // Paragraphes de texte standard
        return (
          <div key={index} className="whitespace-pre-line text-slate-200 leading-relaxed font-sans">
            {part}
          </div>
        );
      })}
    </div>
  );
}

function CodeSnippetBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-xl overflow-hidden my-4 border border-purple-800/40 bg-[#05050f] shadow-lg">
      <div className="flex items-center justify-between px-4 py-2 bg-[#0d0d1e] border-b border-purple-900/30 text-xs">
        <span className="font-mono text-purple-300 uppercase font-semibold text-[11px] tracking-wider">
          {language}
        </span>
        <button
          type="button"
          onClick={handleCopyCode}
          className="flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-white px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-300">Copié</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copier le code</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 text-xs sm:text-sm font-mono text-slate-200 overflow-x-auto leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}
