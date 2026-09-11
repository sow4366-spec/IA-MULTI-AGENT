import { useState } from "react";
import { Copy, Check, FileCode, FolderTree, Rocket, Terminal, ExternalLink, ShieldCheck } from "lucide-react";
import { CODE_TEMPLATES, PROJECT_TREE, VERCEL_DEPLOY_INSTRUCTIONS } from "../data/projectTemplates";

export function NextExportModal() {
  const [selectedFileIdx, setSelectedFileIdx] = useState(0);
  const [activeSubTab, setActiveSubTab] = useState<"files" | "tree" | "vercel">("files");
  const [copiedFile, setCopiedFile] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  const currentFile = CODE_TEMPLATES[selectedFileIdx] || CODE_TEMPLATES[0];

  const handleCopyCurrentFile = () => {
    navigator.clipboard.writeText(currentFile.content);
    setCopiedFile(true);
    setTimeout(() => setCopiedFile(false), 2000);
  };

  const handleCopyAllFiles = () => {
    const combined = CODE_TEMPLATES.map(
      (file) => `// ==========================================\n// FICHIER : ${file.path}\n// ==========================================\n\n${file.content}\n\n`
    ).join("\n");
    navigator.clipboard.writeText(combined);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Bar with actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-6 rounded-2xl bg-[#0b0b18]/90 backdrop-blur-xl border border-purple-500/30 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <Rocket className="w-5 h-5 text-cyan-400" />
              LIVRABLE NEXT.JS 14 & EXPORT VERCEL
            </h2>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              PRÊT À COLLER
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tous les fichiers requis (`app/api/godmode/route.ts`, `lib/ai/godmode.ts`, `lib/ai/callAI.ts`, `schema.prisma`) sont conformes aux spécifications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            id="copy-all-bundle-btn"
            onClick={handleCopyAllFiles}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-950 transition-all active:scale-[0.98]"
          >
            {copiedAll ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Tous les fichiers copiés !</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copier le Bundle Complet</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Sub Tabs: Fichiers / Arborescence / Guide Vercel */}
      <div className="flex items-center gap-2 border-b border-purple-900/40 pb-2">
        <button
          type="button"
          onClick={() => setActiveSubTab("files")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeSubTab === "files"
              ? "bg-purple-600/30 text-purple-200 border border-purple-500/40"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>Fichiers de Code ({CODE_TEMPLATES.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("tree")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeSubTab === "tree"
              ? "bg-purple-600/30 text-purple-200 border border-purple-500/40"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <FolderTree className="w-3.5 h-3.5" />
          <span>Arborescence Complète</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("vercel")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeSubTab === "vercel"
              ? "bg-purple-600/30 text-purple-200 border border-purple-500/40"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Déploiement Vercel & Clé OpenAI</span>
        </button>
      </div>

      {/* Content View */}
      {activeSubTab === "files" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* File Selector Sidebar */}
          <div className="lg:col-span-4 rounded-2xl bg-[#0b0b18]/80 backdrop-blur-xl border border-purple-900/30 p-3 space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 px-3 py-1.5 block">
              Explorateur de Fichiers
            </span>
            {CODE_TEMPLATES.map((file, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedFileIdx(idx)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs transition-all flex items-center justify-between ${
                  selectedFileIdx === idx
                    ? "bg-purple-600/30 text-white border border-purple-500/50 shadow-md shadow-purple-950/40 font-semibold"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <FileCode className="w-3.5 h-3.5 shrink-0 text-purple-400" />
                  <span className="truncate font-mono">{file.path}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Code Viewer */}
          <div className="lg:col-span-8 rounded-2xl bg-[#0b0b18]/90 backdrop-blur-xl border border-purple-500/30 overflow-hidden flex flex-col shadow-2xl">
            {/* Viewer Header */}
            <div className="px-4 py-3 bg-[#0e0e22] border-b border-purple-900/40 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-cyan-300">
                  {currentFile.path}
                </span>
                <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                  {currentFile.description}
                </p>
              </div>

              <button
                type="button"
                id="copy-selected-file-btn"
                onClick={handleCopyCurrentFile}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#14142e] hover:bg-purple-900/40 text-slate-200 border border-purple-800/40 hover:border-purple-500 transition-all shrink-0"
              >
                {copiedFile ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">Copié !</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copier ce fichier</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Body */}
            <pre className="p-4 sm:p-6 text-xs sm:text-sm font-mono text-slate-200 overflow-x-auto leading-relaxed max-h-[500px] overflow-y-auto bg-[#05050f]">
              <code>{currentFile.content}</code>
            </pre>
          </div>
        </div>
      )}

      {/* Tree View */}
      {activeSubTab === "tree" && (
        <div className="rounded-2xl bg-[#0b0b18]/90 backdrop-blur-xl border border-purple-500/30 p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono font-bold text-cyan-300">
              ARBORESCENCE DU PROJET NEXT.JS 14 (APP ROUTER)
            </span>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(PROJECT_TREE);
                setCopiedFile(true);
                setTimeout(() => setCopiedFile(false), 2000);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#14142e] hover:bg-purple-900/40 text-slate-200 border border-purple-800/40 transition-all"
            >
              {copiedFile ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copier l'arborescence</span>
            </button>
          </div>
          <pre className="p-4 rounded-xl bg-[#05050f] border border-purple-900/30 text-xs sm:text-sm font-mono text-purple-200/90 leading-relaxed overflow-x-auto">
            {PROJECT_TREE}
          </pre>
        </div>
      )}

      {/* Vercel Deploy Guide */}
      {activeSubTab === "vercel" && (
        <div className="rounded-2xl bg-[#0b0b18]/90 backdrop-blur-xl border border-purple-500/30 p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-purple-900/30">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-950/60 border border-purple-500/30 text-cyan-300">
                <Rocket className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  DÉPLOIEMENT EN PRODUCTION SUR VERCEL
                </h3>
                <p className="text-xs text-slate-400">
                  Guide pas à pas pour injecter OPENAI_API_KEY et déployer votre API Next.js 14 sans aucune erreur.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(VERCEL_DEPLOY_INSTRUCTIONS);
                setCopiedFile(true);
                setTimeout(() => setCopiedFile(false), 2000);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#14142e] hover:bg-purple-900/40 text-slate-200 border border-purple-800/40 transition-all shrink-0"
            >
              {copiedFile ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copier le guide</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#080816] border border-purple-900/30 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
                ÉTAPE 1
              </span>
              <h4 className="text-sm font-semibold text-white">Créer le projet</h4>
              <p className="text-xs text-slate-400">
                Poussez les fichiers sur GitHub, puis importez le repository dans votre dashboard Vercel.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#080816] border border-purple-900/30 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-bold">
                ÉTAPE 2
              </span>
              <h4 className="text-sm font-semibold text-white">Injecter OPENAI_API_KEY</h4>
              <p className="text-xs text-slate-400">
                Dans <strong>Settings &gt; Environment Variables</strong>, ajoutez <code className="text-purple-300 font-mono">OPENAI_API_KEY</code> avec votre clé secrète OpenAI.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#080816] border border-purple-900/30 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                ÉTAPE 3
              </span>
              <h4 className="text-sm font-semibold text-white">Build & Prisma</h4>
              <p className="text-xs text-slate-400">
                La commande <code className="text-emerald-300 font-mono">npm run build</code> exécute automatiquement <code className="text-emerald-300 font-mono">prisma generate</code> et compile les routes sans erreurs.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#05050f] border border-purple-900/30">
            <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
              {VERCEL_DEPLOY_INSTRUCTIONS}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
