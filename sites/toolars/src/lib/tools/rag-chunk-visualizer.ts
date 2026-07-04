export interface RagChunkVisualizerInput {
  text: string;
  chunkTokens: number;
  overlapTokens: number;
}

export interface RagChunkSettings {
  chunkTokens: number;
  overlapTokens: number;
}

export interface RagChunkPreview {
  index: number;
  text: string;
  estimatedTokens: number;
  overlapTokens: number;
}

export interface RagChunkVisualizerResult {
  settings: RagChunkSettings;
  chunks: RagChunkPreview[];
  totalEstimatedTokens: number;
  summary: string;
  privacyNote: string;
}

export function buildRagChunkPreview(input: RagChunkVisualizerInput): RagChunkVisualizerResult {
  const words = input.text.trim().split(/\s+/).filter(Boolean);
  const chunkTokens = clampInteger(input.chunkTokens, 1, 2000);
  const overlapTokens = clampInteger(input.overlapTokens, 0, Math.max(0, chunkTokens - 1));
  const step = Math.max(1, chunkTokens - overlapTokens);
  const chunks: RagChunkPreview[] = [];

  for (let start = 0; start < words.length; start += step) {
    const chunkWords = words.slice(start, start + chunkTokens);
    if (chunkWords.length === 0) break;
    chunks.push({
      index: chunks.length + 1,
      text: chunkWords.join(" "),
      estimatedTokens: chunkWords.length,
      overlapTokens: chunks.length === 0 ? 0 : Math.min(overlapTokens, chunkWords.length)
    });
    if (start + chunkTokens >= words.length) break;
  }

  return {
    settings: { chunkTokens, overlapTokens },
    chunks,
    totalEstimatedTokens: words.length,
    summary: `${chunks.length} chunks from ${words.length.toLocaleString("en-US")} estimated tokens.`,
    privacyNote: "Local chunk preview only; document text stays in the browser."
  };
}

function clampInteger(value: number, min: number, max: number): number {
  const integer = Number.isFinite(value) ? Math.round(value) : min;
  return Math.min(max, Math.max(min, integer));
}
