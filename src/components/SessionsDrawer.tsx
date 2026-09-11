import { Trash2, ExternalLink, Database, Clock, Terminal } from "lucide-react";
import { SavedSession } from "../types";

interface SessionsDrawerProps {
  sessions: SavedSession[];
  onSelectSession: (session: SavedSession) => void;
  onDeleteSession: (id: string) => void;
}

export function SessionsDrawer({
  sessions,
  onSelectSession,
  onDeleteSession,
}: SessionsDrawerProps) {
  return (
    <div className="w-full space-y-6">
      {/* Overview Header */}
      <div className="p-4 sm:p-6 rounded-2xl bg-[#0b0b18]/90 backdrop-blur-xl border border-purple-500/30 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg sm:text-xl font-black text-white">
              SESSIONS PRISMA ORM
            </h2>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              MODÈLE: Session
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Persistance des prompts, réponses et moteurs conformément à <code className="text-purple-300 font-mono">prisma/schema.prisma</code>.
          </p>
        </div>

        <div className="text-xs font-mono text-slate-400 bg-[#070712] px-3 py-1.5 rounded-lg border border-purple-900/40">
          Total enregistrements : <span className="text-cyan-300 font-bold">{sessions.length}</span>
        </div>
      </div>

      {/* Sessions Grid */}
      {sessions.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-[#0b0b18]/40 border border-purple-900/20">
          <Terminal className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-sm text-slate-400">Aucune session enregistrée pour le moment.</p>
          <p className="text-xs text-slate-500 mt-1">
            Exécutez une requête dans le moteur GODMODE pour créer une session automatique.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="p-5 rounded-2xl bg-[#0b0b18]/90 backdrop-blur-xl border border-purple-900/30 hover:border-purple-500/50 transition-all flex flex-col justify-between shadow-xl space-y-4 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-purple-950 text-purple-300 border border-purple-800/40">
                    {session.engine}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(session.createdAt).toLocaleTimeString()}</span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:text-purple-200 transition-colors">
                  {session.title || "Session Godmode"}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-2 italic font-sans">
                  "{session.prompt}"
                </p>

                <div className="p-2.5 rounded-lg bg-[#070712] text-xs text-slate-300 line-clamp-3 font-mono leading-relaxed border border-purple-950">
                  {session.response}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-purple-950/60">
                <button
                  type="button"
                  onClick={() => onSelectSession(session)}
                  className="flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <span>Recharger dans le Studio</span>
                  <ExternalLink className="w-3 h-3" />
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteSession(session.id)}
                  className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-950/30 transition-colors"
                  title="Supprimer la session"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
