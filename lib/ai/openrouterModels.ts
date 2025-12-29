export const OPENROUTER_MODELS = [
  // Free-tier models on OpenRouter (as of their docs / common catalog)
  "google/gemma-2-9b-it:free",
  "meta-llama/llama-3.1-8b-instruct:free",
  "mistralai/mistral-7b-instruct:free",
] as const;

export type OpenRouterModel = (typeof OPENROUTER_MODELS)[number];

export const DEFAULT_OPENROUTER_MODEL: OpenRouterModel = "google/gemma-2-9b-it:free";

export function isAllowedOpenRouterModel(model: string): model is OpenRouterModel {
  return (OPENROUTER_MODELS as readonly string[]).includes(model);
}


