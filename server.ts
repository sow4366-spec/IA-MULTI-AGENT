import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { runGodmodeEngine } from "./lib/ai/godmode";

dotenv.config();

// Stockage en mémoire des sessions (reflétant le modèle Prisma Session)
interface MemorySession {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  prompt: string;
  response: string;
  engine: string;
}

const sessionsStore: MemorySession[] = [
  {
    id: "session-init-1",
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    title: "Génération Architecture Microservices",
    prompt: "Architecture pour une plateforme financière distribuée à haute fréquence avec tolérance aux pannes.",
    response: "⚡ SYNTHÈSE STRATÉGIQUE\nArchitecture event-driven basée sur Kafka, Raft consensus pour la synchronisation d'état et déploiement Kubernetes multi-régions.\n\n🛠️ COMPOSANTS GODMODE\n- Gateway: Envoy Proxy avec rate-limiting token bucket\n- Ingestion: Apache Kafka en cluster KRaft (zéro ZooKeeper)\n- Moteur: Services Rust natifs compilés en WebAssembly Edge\n- Stockage: CockroachDB (consistance stricte ACID distribuée)",
    engine: "godmode",
  },
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middlewares
  app.use(express.json({ limit: "10mb" }));

  // 1. Health check
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      app: "AI GODMODE ENGINE",
      hasOpenAiKey: Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== "sk-proj-..."),
      hasGeminiFallback: Boolean(process.env.GEMINI_API_KEY),
      timestamp: new Date().toISOString(),
    });
  });

  // 2. Route Godmode API
  app.post("/api/godmode", async (req, res) => {
    try {
      const { prompt, mode } = req.body;

      if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
        return res.status(400).json({
          success: false,
          error: "Le champ 'prompt' est obligatoire et doit être une chaîne non vide.",
        });
      }

      // Exécution du moteur
      const executionResult = await runGodmodeEngine(prompt.trim(), mode);

      // Enregistrement de la session (similaire au model Session de schema.prisma)
      const newSession: MemorySession = {
        id: `sess_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        title: prompt.trim().slice(0, 45) + (prompt.trim().length > 45 ? "..." : ""),
        prompt: prompt.trim(),
        response: executionResult.response,
        engine: executionResult.engine,
      };

      sessionsStore.unshift(newSession);
      if (sessionsStore.length > 50) {
        sessionsStore.pop();
      }

      return res.status(200).json({
        ...executionResult,
        sessionId: newSession.id,
      });
    } catch (err: any) {
      console.error("[SERVER_GODMODE_ERROR]", err);
      return res.status(500).json({
        success: false,
        error: err?.message || "Erreur critique dans l'exécution de GODMODE ENGINE.",
      });
    }
  });

  // 3. Routes Sessions (Prisma style)
  app.get("/api/sessions", (_req, res) => {
    return res.json({
      success: true,
      sessions: sessionsStore,
    });
  });

  app.delete("/api/sessions/:id", (req, res) => {
    const { id } = req.params;
    const index = sessionsStore.findIndex((s) => s.id === id);
    if (index !== -1) {
      sessionsStore.splice(index, 1);
    }
    return res.json({ success: true, remaining: sessionsStore.length });
  });

  // 4. Vite middleware (dev) ou Static files (production)
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[AI GODMODE ENGINE] Serveur actif sur http://0.0.0.0:${PORT}`);
  });
}

startServer();
