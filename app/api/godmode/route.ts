import { NextRequest, NextResponse } from "next/server";
import { runGodmodeEngine } from "@/lib/ai/godmode";

/**
 * Route API Next.js 14 pour le moteur AI GODMODE.
 * URL : /api/godmode (POST)
 * 
 * Aucune dépendance JSX ou composant React.
 * Traite les requêtes JSON, valide le payload, appelle l'IA et renvoie un statut HTTP approprié.
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Extraction et validation du corps de la requête
    const body = await req.json().catch(() => null);

    if (!body || typeof body.prompt !== "string" || body.prompt.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          error: "Le champ 'prompt' est obligatoire et doit être une chaîne non vide.",
        },
        { status: 400 }
      );
    }

    const { prompt, mode } = body;

    // 2. Exécution du moteur GODMODE
    const result = await runGodmodeEngine(prompt.trim(), mode);

    // 3. Réponse propre avec métadonnées
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("[API_GODMODE_ERROR]:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Erreur interne lors de l'exécution du moteur GODMODE.";

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
