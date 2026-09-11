import { CodeTemplateFile } from "../types";

export const PROJECT_TREE = `ai-godmode-engine/
├── app/
│   ├── api/
│   │   └── godmode/
│   │       └── route.ts          # API Route Next.js 14 (sans JSX, gpt-4o-mini)
│   ├── favicon.ico
│   ├── globals.css               # Dark futuriste & Glassmorphism
│   ├── layout.tsx                # Root layout & Fonts
│   └── page.tsx                  # UI Page d'accueil Dark Futuristic
├── lib/
│   └── ai/
│       ├── callAI.ts             # Client OpenAI & fonction callAI({ system, user })
│       └── godmode.ts            # Moteur IA, prompt structuré & raisonnement
├── prisma/
│   └── schema.prisma             # Modèle Session Prisma ORM
├── .env.example                  # Variables d'environnement
├── .env.local                    # Secrets locaux (OPENAI_API_KEY)
├── next.config.mjs               # Config Next.js
├── package.json                  # Next 14, React 18, Prisma 5, OpenAI, TS
├── tailwind.config.ts            # Configuration Tailwind & Glassmorphism
└── tsconfig.json`;

export const CODE_TEMPLATES: CodeTemplateFile[] = [
  {
    path: "app/api/godmode/route.ts",
    filename: "route.ts",
    language: "typescript",
    description: "API Route Next.js 14 App Router : validation, appel OpenAI, gestion d'erreurs (aucun JSX).",
    content: `import { NextRequest, NextResponse } from "next/server";
import { runGodmodeEngine } from "@/lib/ai/godmode";

/**
 * Route API Next.js 14 pour le moteur AI GODMODE.
 * URL : /api/godmode (Méthode : POST)
 * 
 * - Validation stricte du prompt
 * - Appel OpenAI (gpt-4o-mini) via runGodmodeEngine
 * - Zéro JSX / Zéro composant React
 * - Réponses JSON normalisées avec codes HTTP standard
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);

    if (!body || typeof body.prompt !== "string" || body.prompt.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          error: "Le champ 'prompt' est requis et doit être une chaîne non vide.",
        },
        { status: 400 }
      );
    }

    const { prompt, mode } = body;

    // Exécution du moteur GODMODE (prompt système + gpt-4o-mini)
    const result = await runGodmodeEngine(prompt.trim(), mode);

    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    console.error("[API_GODMODE_ERROR]", error);

    const message =
      error instanceof Error ? error.message : "Erreur interne du moteur GODMODE.";

    return NextResponse.json(
      {
        success: false,
        error: message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}`,
  },
  {
    path: "lib/ai/callAI.ts",
    filename: "callAI.ts",
    language: "typescript",
    description: "Client OpenAI officiel et fonction callAI({ system, user, model, temperature }).",
    content: `import OpenAI from "openai";

export interface CallAIOptions {
  system: string;
  user: string;
  model?: string;
  temperature?: number;
}

export interface CallAIResult {
  text: string;
  provider: "openai" | "gemini-fallback";
  model: string;
}

/**
 * Client OpenAI et fonction d'exécution générique callAI.
 * Modèle par défaut : gpt-4o-mini.
 */
export async function callAI({
  system,
  user,
  model = "gpt-4o-mini",
  temperature = 0.7,
}: CallAIOptions): Promise<CallAIResult> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Clé OPENAI_API_KEY introuvable dans les variables d'environnement. " +
      "Veuillez définir OPENAI_API_KEY dans votre fichier .env.local ou dans Vercel."
    );
  }

  const openai = new OpenAI({ apiKey });

  const completion = await openai.chat.completions.create({
    model,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    temperature,
  });

  const text = completion.choices[0]?.message?.content ?? "Aucune réponse générée.";

  return {
    text,
    provider: "openai",
    model,
  };
}`,
  },
  {
    path: "lib/ai/godmode.ts",
    filename: "godmode.ts",
    language: "typescript",
    description: "Moteur IA GODMODE : Prompt système d'élite, directives d'ingénierie et métriques.",
    content: `import { callAI } from "./callAI";

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
 * Prompt système structuré pour le mode AI GODMODE ENGINE.
 * Conçu pour éliminer le bavardage et produire un code durci et exhaustif.
 */
export const GODMODE_SYSTEM_PROMPT = \`Tu es "AI GODMODE ENGINE", l'intelligence d'élite en architecture logicielle, Next.js 14, TypeScript et conception système.

Directives absolues d'exécution :
1. ANALYSE PROFONDE : Décompose les sous-problèmes cachés, failles de sécurité, cas limites et scalabilité.
2. ZÉRO SLOP / ZÉRO PLACEHOLDER : Ne laisse aucun "// TODO". Fournis du code complet, typé, prêt pour la production.
3. RÉSILIENCE : Gestion des erreurs HTTP, validation des entrées (Zod/TypeScript), idempotence.
4. STRUCTURE OBLIGATOIRE DE LA RÉPONSE :
   - ⚡ SYNTHÈSE STRATÉGIQUE (2-3 phrases clés)
   - 🧠 RAISONNEMENT & ARBITRAGES (Justifications des choix techniques)
   - 🛠️ IMPLÉMENTATION GODMODE (Code TypeScript complet & commenté)
   - 🔒 AUDIT & SÉCURITÉ (Complexité O(n), vecteurs d'attaque, robustesse)
5. TON : Précis, incisif, technique, d'une clarté absolue.\`;

export async function runGodmodeEngine(
  prompt: string,
  mode: "godmode-standard" | "godmode-deep-audit" | "godmode-architect" = "godmode-standard"
): Promise<GodmodeExecutionResult> {
  const startTime = Date.now();

  let contextualSystem = GODMODE_SYSTEM_PROMPT;
  if (mode === "godmode-deep-audit") {
    contextualSystem += "\\n\\nFOCUS MODE: Deep Audit (forensique, failles de sécurité, concurrence).";
  } else if (mode === "godmode-architect") {
    contextualSystem += "\\n\\nFOCUS MODE: System Architect (scalabilité globale, sharding, microservices).";
  }

  const aiResult = await callAI({
    system: contextualSystem,
    user: prompt,
    model: "gpt-4o-mini",
    temperature: 0.65,
  });

  const durationMs = Date.now() - startTime;
  const wordCount = (aiResult.text || "").split(/\\s+/).length;
  const tokensEstimated = Math.round(wordCount * 1.35) + Math.round(prompt.split(/\\s+/).length * 1.35);

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
      intent: "Résolution & Synthèse Godmode",
      complexityLevel: prompt.length > 250 ? "NIVEAU OMEGA (Très Élevé)" : "NIVEAU SIGMA (Élevé)",
      keyDirectives: [
        "Inférence haute fidélité (gpt-4o-mini)",
        "Architecture sans compromis",
        "Code production-ready sans omission",
      ],
    },
  };
}`,
  },
  {
    path: "prisma/schema.prisma",
    filename: "schema.prisma",
    language: "prisma",
    description: "Schéma Prisma 5 avec le modèle Session (id, createdAt, title, prompt, response, engine).",
    content: `datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Session {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  title     String
  prompt    String   @db.Text
  response  String   @db.Text
  engine    String   @default("godmode")
}`,
  },
  {
    path: "package.json",
    filename: "package.json",
    language: "json",
    description: "Configuration package.json Next.js 14, React 18, Prisma 5, OpenAI, Tailwind, TypeScript.",
    content: `{
  "name": "ai-godmode-engine",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start",
    "lint": "next lint",
    "postinstall": "prisma generate"
  },
  "dependencies": {
    "@prisma/client": "^5.19.0",
    "lucide-react": "^0.460.0",
    "next": "14.2.13",
    "openai": "^4.63.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/node": "^20.16.5",
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.47",
    "prisma": "^5.19.0",
    "tailwindcss": "^3.4.11",
    "typescript": "^5.6.2"
  }
}`,
  },
  {
    path: ".env.example",
    filename: ".env.example",
    language: "bash",
    description: "Variables d'environnement requises pour le projet Next.js et Vercel.",
    content: `# Clé secrète OpenAI (Obligatoire pour gpt-4o-mini)
# Obtenez-la sur https://platform.openai.com/api-keys
OPENAI_API_KEY="sk-proj-votre_cle_openai_secrete"

# URL de la base de données PostgreSQL (Prisma)
# Compatible Vercel Postgres, Neon, Supabase, ou Render
DATABASE_URL="postgresql://user:password@hostname:5432/godmode_db?sslmode=require"`,
  },
  {
    path: "app/layout.tsx",
    filename: "layout.tsx",
    language: "typescript",
    description: "Layout racine Next.js 14 avec thème Dark futuriste et métadonnées.",
    content: `import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";

const sans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-sans" });
const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "AI GODMODE ENGINE",
  description: "Plateforme IA haute performance Next.js 14, OpenAI GPT-4o-mini et Prisma ORM.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark">
      <body className={\`\${sans.variable} \${display.variable} font-sans bg-[#070712] text-slate-100 min-h-screen antialiased\`}>
        {children}
      </body>
    </html>
  );
}`,
  },
];

export const VERCEL_DEPLOY_INSTRUCTIONS = `# GUIDE DE DÉPLOIEMENT VERCEL - AI GODMODE ENGINE

## 1. Prérequis
- Un compte GitHub (avec le code poussé sur un dépôt)
- Un compte Vercel (https://vercel.com)
- Une clé API OpenAI (https://platform.openai.com/api-keys)

---

## 2. Déploiement en 1 Clic sur Vercel
1. Rendez-vous sur votre tableau de bord Vercel.
2. Cliquez sur **"Add New..."** > **"Project"**.
3. Importez votre dépôt GitHub \`ai-godmode-engine\`.
4. Laissez les réglages Framework par défaut (**Next.js**).

---

## 3. Configuration de la clé OPENAI_API_KEY dans Vercel
Avant de cliquer sur "Deploy" (ou après dans les Settings du projet) :
1. Déroulez la section **"Environment Variables"**.
2. Ajoutez la variable suivante :
   - **Key** : \`OPENAI_API_KEY\`
   - **Value** : \`sk-proj-...\` (votre clé secrète OpenAI)
3. Si vous utilisez Prisma avec PostgreSQL :
   - Ajoutez aussi la variable \`DATABASE_URL\` (ex: fournie par Vercel Postgres ou Neon).
4. Cliquez sur **"Save"**.

---

## 4. Lancement du Build & Déploiement
1. Cliquez sur **"Deploy"**.
2. Vercel compile automatiquement votre Next.js 14 (\`npm run build\` incluant \`prisma generate\`).
3. En moins de 60 secondes, votre projet **AI GODMODE ENGINE** est en ligne avec HTTPS, CDN mondial et API Serverless !`;
