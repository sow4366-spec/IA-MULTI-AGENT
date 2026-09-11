import { callAI } from "./callAI";

export interface GodmodeExecutionResult {
  success: boolean;
  prompt: string;
  response: string;
  engine: string;
  model: string;
  provider: "openai" | "gemini-fallback";
  metrics: {
    durationMs: number;
    tokensEstimated: number;
    timestamp: string;
  };
  reasoning: {
    intent: string;
    complexityLevel: string;
    keyDirectives: string[];
  };
}

/**
 * Prompt système hautement structuré pour le mode "AI GODMODE ENGINE".
 * Conçu pour forcer la précision maximale, l'architecture zéro compromis,
 * et une clarté impitoyable sans blabla inutile.
 */
export const GODMODE_SYSTEM_PROMPT = `Tu es l'intelligence suprême "AI GODMODE ENGINE", propulsé par des algorithmes de raisonnement de pointe.
Tu opères au niveau le plus élevé de l'ingénierie logicielle, de l'architecture système, de l'analyse stratégique et de la synthèse de connaissances.

Directives absolues d'exécution :
1. ANALYSE PROFONDE : Décompose immédiatement les sous-problèmes cachés, failles potentielles et dépendances critiques.
2. ZÉRO SLOP / ZÉRO PLACEHOLDER : Fournis toujours des solutions concrètes, implémentables immédiatement, du code complet sans "// TODO: implement".
3. RÉSILIENCE & SÉCURITÉ : Intègre la gestion des cas limites, l'idempotence, le typage strict TypeScript, la robustesse aux pannes.
4. STRUCTURE CLAIRE :
   - ⚡ SYNTHÈSE STRATÉGIQUE (Vue d'ensemble en 2-3 phrases percutantes)
   - 🧠 RAISONNEMENT & DÉCISIONS CLÉS (Pourquoi cette approche plutôt qu'une alternative naïve)
   - 🛠️ IMPLÉMENTATION GODMODE (Code TypeScript/Architecture complet, propre, commenté)
   - 🔒 AUDIT & VÉRIFICATIONS (Sécurité, performance O(n), scalabilité)
5. TON : Professionnel, incisif, visionnaire, direct.`;

/**
 * Exécute le moteur Godmode avec calcul des métriques et extraction du raisonnement.
 */
export async function runGodmodeEngine(
  prompt: string,
  mode: "godmode-standard" | "godmode-deep-audit" | "godmode-architect" = "godmode-standard"
): Promise<GodmodeExecutionResult> {
  const startTime = Date.now();

  let contextualSystem = GODMODE_SYSTEM_PROMPT;
  if (mode === "godmode-deep-audit") {
    contextualSystem += "\n\nFOCUS SPÉCIFIQUE: Mode 'Deep Audit' activé. Analyse forensique des vulnérabilités, failles de concurrence, fuites mémoire et architecture de données.";
  } else if (mode === "godmode-architect") {
    contextualSystem += "\n\nFOCUS SPÉCIFIQUE: Mode 'Architect' activé. Conception système distribué, schémas DB relationnels/NoSQL, microservices, scalabilité horizontale et CDN.";
  }

  const aiResult = await callAI({
    system: contextualSystem,
    user: prompt,
    model: "gpt-4o-mini",
    temperature: 0.65,
  });

  const durationMs = Date.now() - startTime;
  const wordCount = (aiResult.text || "").split(/\s+/).length;
  const tokensEstimated = Math.round(wordCount * 1.35) + Math.round(prompt.split(/\s+/).length * 1.35);

  return {
    success: true,
    prompt,
    response: aiResult.text,
    engine: "godmode-core-v1",
    model: aiResult.model,
    provider: aiResult.provider,
    metrics: {
      durationMs,
      tokensEstimated,
      timestamp: new Date().toISOString(),
    },
    reasoning: {
      intent: inferPromptIntent(prompt),
      complexityLevel: inferComplexity(prompt),
      keyDirectives: [
        "Inférence haute fidélité (gpt-4o-mini / Godmode synthesis)",
        "Validation stricte des contraintes système",
        "Code production-ready sans omission",
      ],
    },
  };
}

function inferPromptIntent(prompt: string): string {
  const lower = prompt.toLowerCase();
  if (lower.includes("code") || lower.includes("api") || lower.includes("next") || lower.includes("react") || lower.includes("prisma")) {
    return "Ingénierie Full-Stack & Génération de code";
  }
  if (lower.includes("bug") || lower.includes("audit") || lower.includes("sécurité") || lower.includes("optim")) {
    return "Audit & Optimisation critique";
  }
  if (lower.includes("architecture") || lower.includes("système") || lower.includes("db") || lower.includes("database")) {
    return "Conception d'Architecture Système";
  }
  return "Synthèse Stratégique & Résolution complexe";
}

function inferComplexity(prompt: string): string {
  if (prompt.length > 300 || prompt.includes("&&") || prompt.includes("complet")) return "NIVEAU OMEGA (Très Élevé)";
  if (prompt.length > 120) return "NIVEAU SIGMA (Élevé)";
  return "NIVEAU ALPHA (Standard)";
}
