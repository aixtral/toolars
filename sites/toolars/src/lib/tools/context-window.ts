export type ContextWindowStatus = "safe" | "tight" | "overflow";

export interface ContextSegmentInput {
  label: string;
  tokens: number;
}

export interface ContextWindowInput {
  maxTokens: number;
  segments: ContextSegmentInput[];
}

export interface ContextWindowSegment {
  label: string;
  tokens: number;
  percent: number;
}

export interface ContextWindowResult {
  maxTokens: number;
  usedTokens: number;
  remainingTokens: number;
  overflowTokens: number;
  utilizationPercent: number;
  status: ContextWindowStatus;
  segments: ContextWindowSegment[];
  warnings: string[];
  summary: string;
  privacyNote: string;
}

export function visualizeContextWindow(input: ContextWindowInput): ContextWindowResult {
  const maxTokens = Math.max(1, Math.round(input.maxTokens));
  const segments = input.segments.map((segment) => ({
    label: segment.label.trim() || "Segment",
    tokens: Math.max(0, Math.round(segment.tokens)),
    percent: Math.round((Math.max(0, segment.tokens) / maxTokens) * 100)
  }));
  const usedTokens = segments.reduce((sum, segment) => sum + segment.tokens, 0);
  const remainingTokens = Math.max(0, maxTokens - usedTokens);
  const overflowTokens = Math.max(0, usedTokens - maxTokens);
  const utilizationPercent = Math.round((usedTokens / maxTokens) * 100);
  const status = overflowTokens > 0 ? "overflow" : utilizationPercent >= 85 ? "tight" : "safe";
  const warnings = buildWarnings(status, segments);

  return {
    maxTokens,
    usedTokens,
    remainingTokens,
    overflowTokens,
    utilizationPercent,
    status,
    segments,
    warnings,
    summary: `${usedTokens.toLocaleString("en-US")} of ${maxTokens.toLocaleString("en-US")} tokens allocated.`,
    privacyNote: "Local context visualization only; prompt allocations stay in the browser."
  };
}

function buildWarnings(status: ContextWindowStatus, segments: ContextWindowSegment[]): string[] {
  const warnings: string[] = [];
  if (status === "tight") warnings.push("Context is tight; keep output reserve visible before sending.");
  if (status === "overflow") warnings.push("Context allocation exceeds the selected model window.");
  if ((segments.find((segment) => /retrieval/i.test(segment.label))?.percent ?? 0) > 60) {
    warnings.push("Retrieval dominates the window; consider smaller chunks or reranking.");
  }
  return warnings;
}
