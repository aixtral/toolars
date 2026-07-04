export type TokenCounterModelKey =
  | "gpt-4o"
  | "gpt-4o-mini"
  | "claude-3-5-sonnet"
  | "claude-3-5-haiku"
  | "llama-3-1-70b"
  | "llama-3-1-8b";

export interface TokenCounterProfile {
  key: TokenCounterModelKey;
  label: string;
  costPerThousandTokens: number;
}

export interface TokenCounterInput {
  text: string;
  selectedModel: TokenCounterModelKey;
}

export interface TokenCounterModelRow {
  model: TokenCounterProfile;
  estimatedCost: number;
  formattedEstimatedCost: string;
}

export interface TokenCounterResult {
  characterCount: number;
  wordCount: number;
  lineCount: number;
  estimatedTokens: number;
  selectedModel: TokenCounterProfile;
  estimatedCost: number;
  formattedEstimatedCost: string;
  modelRows: TokenCounterModelRow[];
  summary: string;
  privacyNote: string;
}

export const tokenCounterProfiles: Record<TokenCounterModelKey, TokenCounterProfile> = {
  "gpt-4o": {
    key: "gpt-4o",
    label: "GPT-4o",
    costPerThousandTokens: 0.005
  },
  "gpt-4o-mini": {
    key: "gpt-4o-mini",
    label: "GPT-4o mini",
    costPerThousandTokens: 0.00015
  },
  "claude-3-5-sonnet": {
    key: "claude-3-5-sonnet",
    label: "Claude 3.5 Sonnet",
    costPerThousandTokens: 0.003
  },
  "claude-3-5-haiku": {
    key: "claude-3-5-haiku",
    label: "Claude 3.5 Haiku",
    costPerThousandTokens: 0.00025
  },
  "llama-3-1-70b": {
    key: "llama-3-1-70b",
    label: "Llama 3.1 70B",
    costPerThousandTokens: 0.0005
  },
  "llama-3-1-8b": {
    key: "llama-3-1-8b",
    label: "Llama 3.1 8B",
    costPerThousandTokens: 0.0001
  }
};

export function calculateTokenCount(input: TokenCounterInput): TokenCounterResult {
  const text = input.text.trim();
  const selectedModel = tokenCounterProfiles[input.selectedModel] ?? tokenCounterProfiles["gpt-4o"];
  const characterCount = text.length;
  const wordCount = characterCount > 0 ? text.split(/\s+/).filter(Boolean).length : 0;
  const lineCount = characterCount > 0 ? text.split(/\r\n|\r|\n/).length : 0;
  const estimatedTokens = characterCount > 0 ? Math.ceil(characterCount / 4) : 0;
  const estimatedCost = calculateModelCost(estimatedTokens, selectedModel);
  const modelRows = Object.values(tokenCounterProfiles).map((model) => ({
    model,
    estimatedCost: calculateModelCost(estimatedTokens, model),
    formattedEstimatedCost: formatSmallCurrency(calculateModelCost(estimatedTokens, model))
  }));

  return {
    characterCount,
    wordCount,
    lineCount,
    estimatedTokens,
    selectedModel,
    estimatedCost,
    formattedEstimatedCost: formatSmallCurrency(estimatedCost),
    modelRows,
    summary: `${estimatedTokens.toLocaleString("en-US")} estimated tokens for ${selectedModel.label}`,
    privacyNote: "Local estimate only; no prompt text leaves the browser."
  };
}

function calculateModelCost(tokens: number, model: TokenCounterProfile): number {
  return (tokens / 1000) * model.costPerThousandTokens;
}

function formatSmallCurrency(value: number): string {
  return `$${value.toFixed(6)}`;
}
