export interface GodmodeRequest {
  prompt: string;
  engineMode?: 'godmode-standard' | 'godmode-deep-audit' | 'godmode-architect';
  model?: string;
}

export interface GodmodeResponse {
  success: boolean;
  prompt: string;
  response: string;
  engine: string;
  model: string;
  metrics: {
    durationMs: number;
    tokensEstimated: number;
    timestamp: string;
  };
  reasoning?: {
    intent: string;
    complexityLevel: string;
    keyDirectives: string[];
  };
  error?: string;
}

export interface SavedSession {
  id: string;
  createdAt: string;
  title: string;
  prompt: string;
  response: string;
  engine: string;
}

export interface CodeTemplateFile {
  path: string;
  filename: string;
  language: string;
  description: string;
  content: string;
}
